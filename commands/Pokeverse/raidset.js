const Discord = require('discord.js');
const Settings = require('../../models/serverSettings.js');
const RaiderSettings = require('../../models/pokeverseRaiderSettings.js');
const {getMentionChannel, getMentionRole} = require('../../helper.js');
const {pokeverseID} = require('../../specificData/users.json');

module.exports = {
    name: 'raidset',
    description: 'Modify the Pokeverse Lock settings.\n**Make sure you do not add roles that aren\'t supposed to see the channels.**',
    aliases: ['raiderset','rs','rareset'],
    notes: `**Arguments:**\n\`on\`/\`off\`: Enables/Disables the Pokeverse Locks\n\`roles [add/remove] [@mentionRole/roleID/role name/everyone]\`: Adds/Removes target role from locking list (Use everyone to lock @everyone)\n`,

    async execute(message, args, prefix) {
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
                raiderSettings.save().catch(err => console.log(err));
                return message.reply(`the Pokeverse Raider Lock has been **enabled** for this server. See \`${s.prefix}help raid\` on how to use the Raider Lock.`);
            }
            else{
                raiderSettings.raiderLockEnabled = false;
                raiderSettings.save().catch(err => console.log(err));
                return message.reply(`the Pokeverse Raider Lock has been **disabled** for this server. See \`${s.prefix}help raid\` on how to use the Raider Lock.`);
            }
        }

        else if(args[0] === 'roles' || args[0] === 'role'){
            if(!args[1]){
                let list = "";
                raiderSettings.lockRoles.forEach(r => {
                    let check = message.guild.roles.get(r);
                    if(check) list += "- " + check.name + '\n';
                });

                if(list === "") list = "This list is empty.";

                let embed = new Discord.RichEmbed()
                .setColor('GOLD')
                .setTitle(`Pokeverse Lock - Role list`)
                .setDescription(list);

                return message.channel.send(embed);
            }

            const validTypes = [`add`, `remove`, `clear`];
            let type = args[1];
            if(!validTypes.includes(type.toLowerCase())) return message.reply('invalid arguments. The second argument must be either add/remove/clear.');

            if(type === 'clear'){
                const sent = await message.channel.send(`<@${message.author.id}> Are you sure that you want to clear all roles from the role list? O.=.O`);
                await sent.react('✅');
                await sent.react('❌');

                const filter = (reaction, user) => ['✅','❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                const collected = await sent.awaitReactions(filter, {time: 15000, max: 1, errors: ['time']}).catch(collected => message.channel.send('`Timeout`'));

                if(collected.first().emoji.name === '✅'){
                    raiderSettings.lockRoles = [];
                    await raiderSettings.save().catch(err => console.log(err));
                    message.channel.send(`All roles cleared. Use \`${prefix}rs role add [role]\` to add roles.`);
                }
                else{
                    sent.clearReactions();
                    sent.edit(sent.content + `\nRole list clearance cancelled.`);
                }

                return;
            }

            let role = getMentionRole(message, 2, 1);
            if(!role){
                if(args[2] === 'everyone') role = message.guild.defaultRole;
                else return message.reply(`that role does not exist in this server.`);
            }

            if(type === 'add'){
                if(!args[2]) return message.reply(`please specify a role.`);
                if(raiderSettings.lockRoles.find(r => r === role.id)) return message.reply(`role already exists in current role list.`);
                raiderSettings.lockRoles.push(role.id);
                await raiderSettings.save().catch(err => console.log(err));
                return message.reply(`role added to the Raider Lock list.`);
            }

            if(type === 'remove'){
                if(!args[2]) return message.reply(`please specify a role.`);
                raiderSettings.lockRoles.pull(role.id);
                await raiderSettings.save().catch(err => console.log(err));
                return message.reply(`role removed from the Raider Lock list.`);
            }
        }

        else {
            let desc = `**All locks: ${raiderSettings.raiderLockEnabled ? "enabled" : "disabled"}**\n\n`;
            desc += `Currently supports locking:\n- Raiders\n- Rare Pokemons\n- Mega Bosses (Beta)`;

            let embed = new Discord.RichEmbed()
            .setColor(raiderSettings.raiderLockEnabled? "GREEN":"RED")
            .setTitle(`Pokeverse Lock Settings`)
            .setDescription(desc)
            .setFooter(`See ${prefix}help rs for more info.`);

            return message.channel.send(embed);
        }
    }
};
