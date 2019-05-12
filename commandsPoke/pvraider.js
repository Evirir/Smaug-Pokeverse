const Discord = require('discord.js');
const mongoose = require('mongoose');
const Raider = require('../models/pokeverseRaider.js');
const RaiderSettings = require('../models/pokeverseRaiderSettings.js');
const Settings = require('../models/serverSettings.js');
const {getMentionChannel} = require('../helper.js');
const {pokeverseID} = require('../specificData/users.json');

module.exports = {
    name: 'pvraider',
    description: 'If the raiderLock setting is enabled, when a raider pokemon spawns, Smaug will lock the channel. Use this command to unlock/lock the channel.',
    aliases: ['pvraid','pvr','pr'],
    args: true,
    usage: `#mentionChannel/[channelID]`,
    poke: true,

    async execute(message, args) {
        let s = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!s) return console.log(`No guild setting found: pvraider.js`);

        let raiderSettings = await RaiderSettings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!raiderSettings || !raiderSettings.raiderLockEnabled)
            return message.channel.send(`The Raider Lock has not been enabled in this server. Please see \`,,help togglepvraider\` for more info.`);

        let targetChannel = getMentionChannel(message.client, args[0]);
        if(!targetChannel) return message.reply(`I cannot find this channel.`);

        let raider = await Raider.findOne({channelID: targetChannel.id}).catch(err => console.log(err));
        if(!raider || !raider.hasRaider){
            return message.reply(`there is no Raider in that channel!`);
        }


        if(!targetChannel.permissionsFor(message.member).has('SEND_MESSAGES'))
            return message.reply(`you do not have the permission to send messages in that channel!`);

        if(raider.activeUserID === undefined){
            message.channel.overwritePermissions(message.author, {
                SEND_MESSAGES: true
            }, `${message.author.tag} has engaged in a fight with the Raider in #${targetChannel.name}!`);

            raider.activeUserID = message.author.id;
            await raider.save().catch(err => console.log(err));

            return message.channel.send(`${message.author.tag} has engaged in a fight with the Raider in #${targetChannel.name}!`);
        }
        else {
            if(raider.activeUserID === message.author.id){
                message.channel.overwritePermissions(message.author, {
                    SEND_MESSAGES: null
                }, `${message.author.tag} has left the fight with the Raider in #${targetChannel.name}. Use ${s.prefix}pvraider to engage!`);

                raider.activeUserID = null;
                await raider.save().catch(err => console.log(err));

                return message.channel.send(`${message.author.tag} has left the fight with the Raider in #${targetChannel.name}. Use ${s.prefix}pvraider to engage!`);
            }
            else{
                return message.reply(`(${message.client.users.get(raider.activeUserID).username} is currently fighting with the Raider in that channel! He/She must disengage before you can engage in the raid.`);
            }
        }
    }
};
