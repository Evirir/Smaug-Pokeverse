const mongoose = require('mongoose');
const Raider = require('../models/pokeverseRaider.js');
const RaiderSettings = require('../models/pokeverseRaiderSettings.js');
const {getMentionChannel} = require('../helper.js');

module.exports = {
	name: `spawnraid`,
	description: `Fake spawns a Raider pokemon for testing. Add \`d\` or \`r\` as an argument to stop the test.`,
    aliases: [`spawnraider`,`spr`],
	poke: true,
    args: true,
    usage: `#mentionChannel/channelID (d/r)`,
    dev: true,

	async execute(message, args) {
        let targetChannel = getMentionChannel(message, args[0]);
        if(!targetChannel || !message.guild.channels.get(targetChannel.id)) return message.reply(`I cannot find this channel in this server.`);

        let raiderSettings = await RaiderSettings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!raiderSettings){
            return message.channel.send(`Raider Lock is disabled in this server. You're the dev so you know what to do...`);
        }

        let raider = await Raider.findOne({channelID: targetChannel.id}).catch(err => console.log(err));
        if(!raider){
            let newRaider = new Raider({
                channelID: targetChannel.id,
                hasRaider: false,
                activeUserID: undefined
            });
            raider = newRaider;
        }


        if(args.length > 1 && (args[1] === 'r' || args[1] === 'd')){
            raider.hasRaider = false;
            raiderSettings.lockRoles.forEach(r => {
                targetChannel.overwritePermissions(r, {
                    SEND_MESSAGES: true
                }, `The test Raider has committed suicide.`);
            });

            await raider.save().catch(err => console.log(err));
            message.channel.send(`Test raider despawned from <#${targetChannel.id}>.`);
            return targetChannel.send(`🎊Evirir decided to befriend everyone! But who knows how long this will last...🎊`);
        }
        else{
            raider.hasRaider = true;
            raiderSettings.lockRoles.forEach(r => {
                targetChannel.overwritePermissions(r, {
                    SEND_MESSAGES: false
                }, `A test Raider has spawned.`);
            })

            await raider.save().catch(err => console.log(err));
            message.channel.send(`Test raider spawned at <#${targetChannel.id}>.`);
            return targetChannel.send(`.Evirir spawned! Raider Lock activated! >.=.< Type \`,,pvraider\` to unlock the channel and fight the Raider.`);
        }
	}
};
