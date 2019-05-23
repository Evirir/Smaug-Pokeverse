const Discord = require('discord.js');
const mongoose = require('mongoose');
const Raider = require('../models/pokeverseRaider.js');
const RaiderSettings = require('../models/pokeverseRaiderSettings.js');
const Settings = require('../models/serverSettings.js');
const {getMentionChannel} = require('../helper.js');
const {pokeverseID} = require('../specificData/users.json');

module.exports = {
    name: 'raider',
    description: 'If Raider Lock is enabled in this server, when a raider pokemon spawns, Smaug will lock the channel. Use this command to unlock the channel, and use this command again to leave the fight.',
    aliases: ['raid','rs'],
    args: true,
    usage: `#mentionChannel/[channelID]`,
    poke: true,
    notes: `**Use \`,,raidset\` to enable this feature**\n`,

    async execute(message, args) {
        let s = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!s) return console.log(`No guild setting found: raid.js`);

        let raiderSettings = await RaiderSettings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!raiderSettings || !raiderSettings.raiderLockEnabled)
            return message.channel.send(`Raider Lock is disabled in this server. Please see \`${s.prefix}help raidset\` for more info.`);

        let targetChannel = getMentionChannel(message, args[0]);
        if(!targetChannel) return message.reply(`I cannot find this channel in this server.`);

        let raider = await Raider.findOne({channelID: targetChannel.id}).catch(err => console.log(err));
        if(!raider || !raider.hasRaider){
            return message.reply(`there is no Raider in that channel!`);
        }

        if(!raider.activeUserID){
            targetChannel.overwritePermissions(message.author, {
                SEND_MESSAGES: true
            }, `${message.author.tag} has engaged in a fight with the Raider in **#${targetChannel.name}**!`);

            raider.activeUserID = message.author.id;

            await raider.save().catch(err => console.log(err));
            targetChannel.send(`**${message.author.tag}** has engaged in a fight with the Raider in **#${targetChannel.name}**!\n\n**PLEASE, REMEMBER TO USE \`${s.prefix}raid\` AGAIN BEFORE YOU EXIT!`);
            if(targetChannel !== message.channel) message.channel.send(`**${message.author.tag}** has engaged in a fight with the Raider in **#${targetChannel.name}**!`);
            return;
        }
        else {
            if(raider.activeUserID === message.author.id){
                targetChannel.overwritePermissions(message.author, {
                    SEND_MESSAGES: null
                }, `${message.author.tag} has left the fight with the Raider in **#${targetChannel.name}**. Use \`${s.prefix}raid #${targetChannel.name}\` to engage!`);

                raider.activeUserID = undefined;
                await raider.save().catch(err => console.log(err));

                targetChannel.send(`**${message.author.tag}** has left the fight with the Raider in **#${targetChannel.name}**. Use \`${s.prefix}raid #${targetChannel.name}\` to engage!`);
                if(targetChannel !== message.channel) message.channel.send(`**${message.author.tag}** has left the fight with the Raider in **#${targetChannel.name}**. Use \`${s.prefix}raid #${targetChannel.name}\` to engage!`);
                return;
            }
            else{
                return message.channel.send(`**${message.client.users.get(raider.activeUserID).tag}** is currently fighting with the Raider in that channel! He/She must disengage before you can engage in the raid.`);
            }
        }
    }
};
