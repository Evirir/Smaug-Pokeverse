const Discord = require('discord.js');
const mongoose = require('mongoose');
const Settings = require('../models/serverSettings.js');
const RaiderSettings = require('../models/pokeverseRaiderSettings.js');
const {getMentionChannel, getMentionRole} = require('../helper.js');
const {pokeverseID} = require('../specificData/users.json');

module.exports = {
    name: 'togglepvraider',
    description: 'Modify the Raider Lock settings.',
    aliases: ['tpvr','tpr'],
    args: true,
    poke: true,
    notes: `**Arguments:**\n\`on\`/\`off\`: Enables/Disables the Raider Lock\n\`roles [add/remove] [@mentionRole/roleID/everyone]\`: Adds/Removes target role from locking list (Use everyone to lock @everyone)\n`,

    async execute(message, args) {
        let s = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!s) return console.log(`No guild settings found: togglepvraider.js`);

        let raiderSettings = await RaiderSettings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!raiderSettings){
            let newRaiderSettings = new RaiderSettings({
                serverID: message.guild.id,
                raiderLockEnabled: false,
                lockRoles: []
            });
            raiderSettings = newRaiderSettings;
        }

        if(args[0] === 'on' || args[0] === 'off'){
            if(args[0] === 'on'){
                raiderSettings.raiderLockEnabled = true;
                return message.reply(`the Pokeverse Raider Lock has been **enabled** for this server. See \`${s.prefix}help pvraider\` on how to use the Raider Lock.`);
            }
            else{
                raiderSettings.raiderLockEnabled = false;
                return message.reply(`the Pokeverse Raider Lock has been **disabled** for this server. See \`${s.prefix}help pvraider\` on how to use the Raider Lock.`);
            }
        }

        else if(args[0] === 'roles' || args[0] === 'role'){
            let type = args[1];
            if(type !== 'add' && type !== 'remove') return message.reply('invalid arguments. The second argument must be either add/remove.');

            let role = getMentionRole(message.client, args[2]);
            if(!role){
                if(args[2] === 'everyone') role = message.guild.defaultRole;
                else return message.reply(`that role does not exist in this server.`);
            }

            if(type === 'add')  raiderSettings.lockRoles.push(role.id);
            else                raiderSettings.lockRoles.pull(role.id);

            await raiderSettings.save().catch(err => console.log(err));
            return message.reply(`role saved to Raider Lock list.`);
        }

        else {
            return message.reply(`invalid arguments. The first argument must be one of on/off/roles.`);
        }
    }
};
