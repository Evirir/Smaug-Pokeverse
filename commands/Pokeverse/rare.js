const Discord = require('discord.js');
const Raider = require('../../models/pokeverseRaider.js');
const RaiderSettings = require('../../models/pokeverseRaiderSettings.js');
const Settings = require('../../models/serverSettings.js');
const {getMentionChannel} = require('../../helper.js');
const {pokeverseID} = require('../../specificData/users.json');

module.exports = {
    name: 'rare',
    description: 'If Raider Lock is enabled in this server, when a rare pokemon spawns, Smaug will lock the channel (just like when Raiders spawn). Use this command to unlock the channel.',
    args: true,
    usage: `[channel]`,
    notes: `**Use \`,,raidset on\` to enable this feature**\n`,

    async execute(message, args, prefix) {

        let raiderSettings = await RaiderSettings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!raiderSettings || !raiderSettings.raiderLockEnabled)
            return message.channel.send(`Raider/Rare Lock is disabled in this server. Please see \`${prefix}help raidset\` for more info.`);

        let targetChannel = getMentionChannel(message, 0);
        if(!targetChannel) return message.reply(`I cannot find this channel in this server.`);

        let raider = await Raider.findOne({channelID: targetChannel.id}).catch(err => console.log(err));
        if(!raider || !raider.hasRare){
            return message.reply(`there is no rare Pokémon in that channel!`);
        }

        if(!raider.activeUserID){
            targetChannel.overwritePermissions(message.author, {
                SEND_MESSAGES: true
            });

            raider.activeUserID = message.author.id;

            await raider.save().catch(err => console.log(err));
            targetChannel.send(`**${message.author.tag}** has came for the rare Pokémon in **#${targetChannel.name}**!\n(In case after you exited the battle but the channel is still locked, please use \`${prefix}rare #${targetChannel.name}\` again.)`);
            if(targetChannel !== message.channel) message.channel.send(`**${message.author.tag}** has went for the rare Pokémon in **#${targetChannel.name}**!`);
            return;
        }
        else {
            if(raider.activeUserID === message.author.id){
                const exiterPerm = targetChannel.permissionOverwrites.get(message.author.id);
                if(exiterPerm) exiterPerm.delete();

                raider.activeUserID = undefined;
                await raider.save().catch(err => console.log(err));

                targetChannel.send(`**${message.author.tag}** has left the battle in **#${targetChannel.name}**. Use \`${prefix}rare #${targetChannel.name}\` to engage!`);
                if(targetChannel !== message.channel) message.channel.send(`**${message.author.tag}** has left the battle in **#${targetChannel.name}**. Use \`${prefix}rare #${targetChannel.name}\` to engage!`);
                return;
            }
            else{
                return message.channel.send(`**${message.client.users.get(raider.activeUserID).tag}** is currently fighting with the rare Pokémon in that channel! He/She must disengage before you can engage in the battle.`);
            }
        }
    }
};
