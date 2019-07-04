const Raider = require('../../models/pokeverseRaider.js');
const RaiderSettings = require('../../models/pokeverseRaiderSettings.js');
const {pokeverseID} = require('../../specificData/users.json');
const {getMentionChannel, getMentionUser, lockRoles, unlockRoles} = require('../../helper.js');

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
