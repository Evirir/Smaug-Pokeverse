const {dragID, godID, geomID, dragTag, pokecordID, pokeverseID} = require('../specificData/users.json');
const {consoleID, pokeverseLogID} = require('../specificData/channels.json');
const {getMentionChannel, statusToPokeType, lockRoles, unlockRoles} = require('../helper.js');

const Raider = require('../models/pokeverseRaider.js');
const RaiderSettings = require('../models/pokeverseRaiderSettings.js');

module.exports = {
    async execute(client, message, prefix){

        let raiderSettings = await RaiderSettings.findOne({serverID: message.guild.id}).catch(err => console.log(err));

        if(raiderSettings && raiderSettings.raiderLockEnabled){

            let raider = await Raider.findOne({channelID: message.channel.id}).catch(err => console.log(err));
            if(!raider){
                raider = new Raider({
                    channelID: message.channel.id,
                    status: undefined
                });
            }

            let targetEmbed;    //variable for checking embed contents

            //SPAWNS (no special pokes)
            if(raider.status === undefined)
            {
                //Rare pokemon spawned
                if(message.content.toLowerCase().includes(`a rare pok`)){
                    const status = 'rare';
                    lockRoles(client, message, prefix, lockRoles, raider, raiderSettings, status);
                    return;
                }

                if(!message.embeds) return;

                //Raider spawned
                targetEmbed = message.embeds.find(e => (e.footer && e.footer.text.includes(`!fightr / !fr`)));
                if(targetEmbed){
                    const status = 'raider';
                    lockRoles(client, message, prefix, lockRoles, raider, raiderSettings, status);
                    return;
                }

                //Mega boss spawned
                targetEmbed = message.embeds.find(e => (e.title.includes(`Mega (Boss)`)));
                if(targetEmbed){
                    const status = 'megaboss';
                    lockRoles(client, message, prefix, lockRoles, raider, raiderSettings, status);
                    return;
                }

                return;
            }

            //has Raider
            if(raider.status === 'raider')
            {
                //User left raid
                if(message.content.includes(`You exited the battle.`)){
                    const targetUser = message.client.users.get(raider.activeUserID);

                    if(!targetUser) return message.channel.send(`Someone has left the battle here. Use \`${prefix}raid #${message.channel.name}\` to engage!`);

                    const exiterPerm = message.channel.permissionOverwrites.get(targetUser.id);
                    if(exiterPerm) exiterPerm.delete();

                    message.channel.send(`**${targetUser.tag}** has left the battle here. Use \`${prefix}raid #${message.channel.name}\` to engage!`);

                    raider.activeUserID = undefined;
                    await raider.save().catch(err => console.log(err));

                    return;
                }

                if(!message.embeds) return;

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

                    raider.status = undefined;
                    raider.activeUserID = undefined;
                    raider.spawnedBy = undefined;
                    await raider.save().catch(err => console.log(err));

                    return;
                }


                //Raider despawned
                targetEmbed = message.embeds.find(e => e.footer === `!fight / !catch / !travel`);
                if(targetEmbed && raider.status === 'raider'){
                    raiderSettings.lockRoles.forEach(async r => {
                        await message.channel.overwritePermissions(message.guild.roles.get(r), {
                            SEND_MESSAGES: true
                        });
                    });

                    console.log(`Raider despawned at ${message.guild.name}/${message.channel.name}`);
                    message.channel.send(`The Raider has despawned...channel unlocked.`);

                    raider.status = undefined;
                    raider.activeUserID = undefined;
                    raider.spawnedBy = undefined;
                    await raider.save().catch(err => console.log(err));

                    return;
                }
            }

            //has Rare Pokemon
            if(raider.status === 'rare')
            {
                //Rare Pokémon killed/captured
                targetEmbed = message.embeds.find(e => e.description && (e.description.includes(`has been captured by`) || e.description.includes(`has been killed by`)) && !(e.description.includes(`Lucky`) || e.description.includes(`Shiny`)) );

                if(targetEmbed){
                    let status = 'killed';
                    if(targetEmbed.description.includes(`captured`)) status = `captured`;

                    console.log(`Rare Pokémon ${status} at ${message.guild.name}/${message.channel.name}`);
                    const msg = `The rare Pokémon has been ${status} by **${targetEmbed.author.name}**.`;
                    message.channel.send(msg);

                    const tamer = await message.client.users.find(u => u.username === targetEmbed.author.name);
                    const tamerPerm = message.channel.permissionOverwrites.get(tamer.id);
                    if(tamerPerm) tamerPerm.delete();

                    const targetChannel = getMentionChannel(targetEmbed.description.slice(targetEmbed.description.indexOf('<#'), -1));
                    if(!targetChannel) console.log(`pokeverse.js: No target channel found.`);

                    unlockRoles(message, targetChannel, raider, raiderSettings);
                    return;
                }

                return;
            }

            //has Mega Boss
            if(raider.status === 'megaboss')
            {
                if(!message.embeds) return;

                //Mega Boss killed
                targetEmbed = message.embeds.find(e => e.description.includes(`won the battle against a wild Mega (Boss)`));
                if(targetEmbed){
                    unlockRoles(message, message.channel, raider, raiderSettings);
                    return;
                }

                return;
            }

            //Shiny ✨  rare 💎
            //if(raider.status === 'shiny'){

            //}

        }
    }
}
