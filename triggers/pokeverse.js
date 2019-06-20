const {dragID, godID, geomID, dragTag, pokecordID, pokeverseID} = require('../specificData/users.json');
const {consoleID, pokeverseLogID} = require('../specificData/channels.json');
const {getMentionChannel} = require('../helper.js');

const Raider = require('../models/pokeverseRaider.js');
const RaiderSettings = require('../models/pokeverseRaiderSettings.js');

module.exports = {
    async execute(client, message, prefix){
        if(!message.embeds) message.client.channels.get(consoleID).send("**PV Message:**\n"+message);
        else{
            message.embeds.forEach(e => {
                let msg = "**PV Embed:**\n";
                if(e.title) msg += `Title: ${e.title}\n`;
                if(e.description) msg += `Description: ${e.description}\n`;
                if(e.author) msg += `Author: ${e.author.name}\n`;
                if(e.footer) msg += `Footer: ${e.footer.text}\n`;
                message.client.channels.get(pokeverseLogID).send(msg).catch(err => console.log(err));
            });
        }

        let raiderSettings = await RaiderSettings.findOne({serverID: message.guild.id}).catch(err => console.log(err));

        if(raiderSettings && raiderSettings.raiderLockEnabled){

            let raider = await Raider.findOne({channelID: message.channel.id}).catch(err => console.log(err));
            if(!raider){
                let newRaider = new Raider({
                    channelID: message.channel.id,
                    hasRaider: false
                });
                raider = newRaider;
            }

            //user left raid
            if(raider.hasRaider && message.content.includes(`You exited the battle.`)){
                const targetUser = message.client.users.get(raider.activeUserID);

                if(!targetUser) return message.channel.send(`Someone has left the raid here. Use \`${prefix}raid #${message.channel.name}\` to engage!`);

                const exiterPerm = message.channel.permissionOverwrites.get(targetUser.id);
                if(exiterPerm) exiterPerm.delete();

                message.channel.send(`**${targetUser.tag}** has left the raid here. Use \`${prefix}raid #${message.channel.name}\` to engage!`);

                raider.activeUserID = undefined;
                await raider.save().catch(err => console.log(err));

                return;
            }

            //Rare pokemon spawned
            if(message.content.includes(`A rare Pokémon has spawned`)){
                raider.hasRare = true;
                raider.hasRaider = false;
                raider.activeUserID = undefined;
                raider.spawnedBy = undefined;

                raiderSettings.lockRoles.forEach(r => {
                    message.channel.overwritePermissions(message.guild.roles.get(r), {
                        SEND_MESSAGES: false
                    }).catch(err => {
                        console.log(err);
                        return message.channel.send(`Failed to lock channel for one of the roles! Please use one of the solutions below, then use the \`,,spr\` command to lock the channel:\n1) Enable the 'Administrator' permission of the 'Smaug' role.\n2) Give Smaug the 'Manage Channel Permissions' in the channel. (You have to do this for every channel where Raiders may spawn.)`);
                    });
                });

                //exclude pokeverse
                let pokeverseUser = message.client.users.get(pokeverseID);
                message.channel.overwritePermissions(pokeverseUser, {
                    SEND_MESSAGES: true
                }).catch(err => console.log(err));

                await raider.save().catch(err => console.log(err));
                console.log(`Rare Pokémon spawned at ${message.guild.name}/${message.channel.name}`);

                //Cuz that guy wants me to send him messages when rare pokes spawn so yeah here you go
                const GeomKidRares = ["560682433373011972", "569251212101156876", "586207192894537728"];
                if(GeomKidRares.includes(message.guild.id)) message.client.users.get(geomID).send(`Rare Pokémon spawned at ${message.guild.name}/${message.channel.name}. (Channel ID: ${message.channel.id})`);

                return message.channel.send(`Rare Pokémon spawned! Type \`${prefix}rare #${message.channel.name}\` in other channels to unlock the channel.\nSpawned by: **${targetEmbed.author.name}**`).catch(err => console.log(err));
            }

            if(!message.embeds) return;

            //Raider spawned
            let targetEmbed = message.embeds.find(e => (e.footer && e.footer.text.includes(`!fightr / !fr`)));

            if(targetEmbed){
                raider.hasRaider = true;
                raider.spawnedBy = targetEmbed.author.name;

                raiderSettings.lockRoles.forEach(r => {
                    message.channel.overwritePermissions(message.guild.roles.get(r), {
                        SEND_MESSAGES: false
                    }).catch(err => {
                        console.log(err);
                        return message.channel.send(`Failed to lock channel for one of the roles! Please ensure that Smaug has 'Manage Channel Permissions' on in the channel.`);
                    });
                });

                //exclude pokeverse
                let pokeverseUser = message.client.users.get(pokeverseID);
                message.channel.overwritePermissions(pokeverseUser, {
                    SEND_MESSAGES: true
                }).catch(err => console.log(err));

                await raider.save().catch(err => console.log(err));
                console.log(`Raider spawned at ${message.guild.name}/${message.channel.name}`);

                const geomUser = await message.client.users.get(geomID);
                if(message.guild.member(geomUser)) geomUser.send(`Raider spawned at ${message.guild.name}/${message.channel.name}`);
                return message.channel.send(`Raider Lock activated! Type \`${prefix}raid #${message.channel.name}\` in other channels to unlock the channel and fight the Raider.\nSpawned by: **${targetEmbed.author.name}**`).catch(err => console.log(err));
            }

            //Raider tamed
            targetEmbed = message.embeds.find(e => e.description && e.description.includes(`You have successfully tamed a Raider!`));

            if(targetEmbed){
                console.log(`Raider tamed at ${message.guild.name}/${message.channel.name}`);
                let msg = `🎊 The Raider has been tamed by **${targetEmbed.author.name}**! 🎊`;
                if(raider.spawnedBy){
                    msg += `\nThis raider is spawned by **${raider.spawnedBy}**.`;
                    console.log(`spawnedBy found: ${raider.spawnedBy}`);
                }
                message.channel.send(msg);

                const tamer = await message.client.users.find(u => u.username === targetEmbed.author.name);
                const tamerPerm = message.channel.permissionOverwrites.get(tamer.id);
                if(tamerPerm) tamerPerm.delete();

                raiderSettings.lockRoles.forEach(async r => {
                    await message.channel.overwritePermissions(message.guild.roles.get(r), {
                        SEND_MESSAGES: true
                    });
                    console.log(`${message.guild.name}/${message.channel.name}: ${message.guild.roles.get(r).name} unlocked.`);
                });

                raider.hasRaider = false;
                raider.activeUserID = undefined;
                raider.spawnedBy = undefined;
                await raider.save().catch(err => console.log(err));

                return;
            }

            //Rare Pokémon killed/captured
            targetEmbed = message.embeds.find(e => e.description && (e.description.includes(`has been captured by`) || e.description.includes(`has been killed by`)) && !(e.description.includes(`Lucky`) || e.description.includes(`Shiny`)) );

            if(targetEmbed){
                let status = "";
                if(targetEmbed.description.includes(`captured`)) status = `captured`;
                else status = `killed`;


                console.log(`Rare Pokémon ${status} at ${message.guild.name}/${message.channel.name}`);
                const msg = `The rare Pokémon has been ${status} by **${targetEmbed.author.name}**.`;
                message.channel.send(msg);

                const tamer = await message.client.users.find(u => u.username === targetEmbed.author.name);
                const tamerPerm = message.channel.permissionOverwrites.get(tamer.id);
                if(tamerPerm) tamerPerm.delete();

                const targetChannel = getMentionChannel(targetEmbed.description.slice(e.description.indexOf('<#'), -1));
                if(!targetChannel) console.log(`pokeverse.js: No target channel found.`);

                raiderSettings.lockRoles.forEach(async r => {
                    await targetChannel.overwritePermissions(message.guild.roles.get(r), {
                        SEND_MESSAGES: true
                    });
                    console.log(`${message.guild.name}/${targetChannel.name}: ${message.guild.roles.get(r).name} unlocked.`);
                });

                raider.hasRare = false;
                raider.activeUserID = undefined;
                raider.spawnedBy = undefined;
                await raider.save().catch(err => console.log(err));

                return;
            }

            //Raider despawned
            targetEmbed = message.embeds.find(e => e.footer === `!fight / !catch / !travel`);
            if(targetEmbed){
                raiderSettings.lockRoles.forEach(async r => {
                    await message.channel.overwritePermissions(message.guild.roles.get(r), {
                        SEND_MESSAGES: true
                    });
                });

                console.log(`Raider despawned at ${message.guild.name}/${message.channel.name}`);
                message.channel.send(`The Raider has despawned...`);

                raider.hasRaider = false;
                raider.activeUserID = undefined;
                raider.spawnedBy = undefined;
                await raider.save().catch(err => console.log(err));
            }

        }
    }
}
