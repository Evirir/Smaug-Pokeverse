const {dragID, godID, dragTag, pokecordID, pokeverseID} = require('../specificData/users.json');
const {consoleID, pokeverseLogID} = require('../specificData/channels.json');

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

            if(raider.hasRaider && message.content.includes(`You exited the battle.`)){
                const targetUser = message.client.users.get(raider.activeUserID);

                message.channel.overwritePermissions(targetUser, {
                    SEND_MESSAGES: null
                });

                message.channel.send(`**${targetUser.tag}** has left the raid in **#${message.channel.name}**. Use \`${prefix}raid #${message.channel.name}\` to engage!`);

                raider.activeUserID = undefined;
                await raider.save().catch(err => console.log(err));

                return;
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
                    });
                });

                await raider.save().catch(err => console.log(err));
                console.log(`Raider spawned at ${message.guild.name}/${message.channel.name}`);
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
