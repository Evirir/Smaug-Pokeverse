const Raider = require('../../models/pokeverseRaider.js');
const RaiderSettings = require('../../models/pokeverseRaiderSettings.js');
const {pokeverseID} = require('../../specificData/users.json');
const {getMentionChannel, getMentionUser} = require('../../helper.js');

async function lockRoles(client, message, prefix, raider, raiderSettings, status, targetEmbed){

    //exclude pokeverse first
    const pokeverseUser = client.users.get(pokeverseID);
    await message.channel.overwritePermissions(pokeverseUser, {
        SEND_MESSAGES: true
    }).catch(err => console.log(err));

    let roleError = false;

    const lockRoles = raiderSettings.lockRoles;
    lockRoles.forEach(async r => {
        const role = message.guild.roles.get(r);
        if(!role){
            raiderSettings.lockRoles.pull(r);
            return;
        }

        await message.channel.overwritePermissions(role, {
            SEND_MESSAGES: false
        }).catch(err => {
            console.log(err);
            if(!roleError){
                roleError = true;
                return message.channel.send(`Failed to lock channel for one of the roles! Please ensure that Smaug has the 'Manage Permissions' permission in the channel.`);
            }
        });
    });

    //Check if the active user is still raiding. If yes, remove his permission to send messages.
    //Thus - make sure you lockRoles() first before changing the raider properties
    const activeUserPerm = message.channel.permissionOverwrites.get(raider.activeUserID);
    if(activeUserPerm) activeUserPerm.delete();

    raider.status = status;
    raider.activeUserID = undefined;
    raider.spawnedBy = undefined;
    await raider.save().catch(err => console.log(err));

    //logging and sending messages
    const pokeType = statusToPokeType(status);

    console.log(`${pokeType} spawned at ${message.guild.name}/${message.channel.name} (${message.guild.id}/${message.channel.id})`);

    const geomUser = await client.users.get(geomID);
    if(message.guild.member(geomUser)) geomUser.send(`${pokeType} spawned at ${message.guild.name}/${message.channel.name}`);


    let msg = `A ${pokeType} has spawned! Type \`${prefix}raid #${message.channel.name}\` in other channels to unlock the channel and fight the ${pokeType}.`;

    if(targetEmbed && targetEmbed.author){
        msg += `\nSpawned by: **${targetEmbed.author.name}**`;
    }

    return message.channel.send(msg).catch(err => console.log(err));
}

function unlockRoles(message, targetChannel, raider, raiderSettings){
    raiderSettings.lockRoles.forEach(async r => {
        await targetChannel.overwritePermissions(message.guild.roles.get(r), {
            SEND_MESSAGES: true
        });
        console.log(`${message.guild.name}/${targetChannel.name}: ${message.guild.roles.get(r).name} unlocked. (${targetChannel.guild}/${targetChannel.id})`);
    });

    raider.status = undefined;
    raider.activeUserID = undefined;
    raider.spawnedBy = undefined;
    raider.save().catch(err => console.log(err));
}

module.exports = {
	name: `spawnraid`,
	description: `Let Smaug act like when a Raider spawns/despawns. Add \`d\` or \`r\` as the 2nd argument to despawn.`,
    aliases: [`spawnraider`,`spr`],
    args: true,
    usage: `#mentionChannel/channelID [user/d/r]`,

	async execute(message, args, prefix) {
        let targetChannel = getMentionChannel(message, 0);
        if(!targetChannel || !message.guild.channels.get(targetChannel.id)) return message.reply(`I cannot find this channel in this server.`);

        let raiderSettings = await RaiderSettings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!raiderSettings){
            return message.channel.send(`Raider Lock is disabled in this server. You're the dev so you know what to do...`);
        }

        let raider = await Raider.findOne({channelID: targetChannel.id}).catch(err => console.log(err));
        if(!raider){
            raider = new Raider({
                channelID: targetChannel.id,
                status: undefined,
            });
        }

        if(args.length > 1 && (args[1] === 'r' || args[1] === 'd')){
            raider.status = undefined;
			raider.activeUserID = undefined;
			raider.spawnedBy = undefined;

            raiderSettings.lockRoles.forEach(r => {
                targetChannel.overwritePermissions(r, {
                    SEND_MESSAGES: true
                });
            });

            await raider.save().catch(err => console.log(err));
			console.log(`Test Raider despawned from #${targetChannel.name}.`);
            message.channel.send(`Test Raider despawned from #${targetChannel.name}.`);
            if(message.channel !== targetChannel) targetChannel.send(`Test Raider despawned.`);
			return;
        }

        else{
            raider.status = 'raider';
			raider.activeUserID = undefined;

			let spawnerMsg = "";
			if(args.length > 1){
				const spawnerUser = getMentionUser(message, 1);
				if(!spawnerUser) return message.reply(`invalid spawner.`);
				spawnerMsg = `\nSpawned by: **${spawnerUser.username}**`;
				raider.activeUserID = spawnerUser.id;

				console.log(`spawnedBy found: ${spawnerUser.username}`);
			}

            raiderSettings.lockRoles.forEach(r => {
                targetChannel.overwritePermissions(r, {
                    SEND_MESSAGES: false
                }).catch(err => console.log(err));
            });

			//exclude pokeverse
			let pokeverseUser = message.client.users.get(pokeverseID);
			message.channel.overwritePermissions(pokeverseUser, {
				SEND_MESSAGES: true
			}).catch(err => console.log(err));

            await raider.save().catch(err => console.log(err));
			console.log(`Test raider spawned at #${targetChannel.name}.`);
            message.channel.send(`Test raider spawned at #${targetChannel.name}.`);
            return targetChannel.send(`Raider Lock activated! Type \`${prefix}raid #${targetChannel.name}\` in other channels to unlock the channel and fight the Raider.` + spawnerMsg);
        }
	}
};
