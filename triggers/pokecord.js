const Discord = require('discord.js');

const {dragID, godID, dragTag, pokecordID, pokeverseID} = require('../specificData/users.json');
const {consoleID, messageID, pokecordLogID} = require('../specificData/channels.json');

const db = require('../pokemons/pokemons.json');
const imghash = require('imghash');
const request = require('request').defaults({ encoding: null });

const LastSpawns = require('../models/pokemonLastSpawn.js');
const WishlistP = require('../models/wishlistPokemon.js');
const Subs = require('../models/pokemonSubscribers.js');

module.exports = {
    async execute(client, message, prefix){
        message.embeds.forEach(async (e) => {
            if (e.description !== undefined && e.description.startsWith("Guess the pokémon and type")) {
                if (e.image) {
                    let url = e.image.url;

                request(url, async function(err, res, body) {
                    if (err !== null) return;

                    imghash
                        .hash(body)
                        .then(async hash => {
                            let result = db[hash];

                            if (result === undefined) {
                                let embed = new Discord.RichEmbed()
                                .setColor(0xFF4500)
                                .setTitle("Pokémon Not Found")
                                .setDescription(`Please contact the owner ${message.client.users.get(dragID).username} to add this Pokémon to the database.`);
                                message.channel.send(embed);
                                return message.client.channels.get(consoleID).send(`Unknown pokemon found at ${message.guild.name}/${message.channel.name}(${message.channel.id})/${message.id}. Hash: ${hash}`);
                            }

                            let Spawn = await LastSpawns.findOne({channelID: message.channel.id}).catch(err => console.log(err));

                            if(!Spawn){
                                const newSpawn = new LastSpawns({
                                    channelID: message.channel.id,
                                    lastSpawn: result
                                });
                                newSpawn.save().catch(err => console.log(err));
                            }
                            else{
                                Spawn.lastSpawn = result;
                                Spawn.capturedBy = null;
                                Spawn.save().catch(err => console.log(err));
                            }

                            const wp = await WishlistP.findOne({name: result}).catch(err => console.log(err));

                            if(wp && wp.wishedBy.length){
                                let msg = `Wished by: `;
                                wp.wishedBy.forEach(u => {
                                    const user = message.client.users.get(u);
                                    if(user && message.guild.member(user)){
                                        msg += `<@${u}> `;

                                        let embed = new Discord.RichEmbed()
                                        .setColor('GOLD')
                                        .setTitle(`**${result}** spawned: Your wished Pokémon!`)
                                        .setDescription(`Location: ${message.guild.name}/${message.channel.name}\n[**Message link**](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id} "${result}")`);

                                        user.send(embed);
                                    }
                                    message.channel.send(msg);
                                    console.log(msg);
                                });
                            }

                            let sub = await Subs.findOne().catch(err => console.log(err));
                            let sb = sub.subs;

                            let embed = new Discord.RichEmbed()
                            .setColor('GREEN')
                            .setTitle(`**${result}** spawned`)
                            .setDescription(`Location: ${message.guild.name}/${message.channel.name}\n[**Message link**](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id} "${result}")`);

                            sb.forEach(u => {
                                if(message.guild.member(u) && !wp.wishedBy.includes(u)){
                                    client.users.get(u).send(embed);
                                }
                            });

                            console.log(`${message.guild.name}/${message.channel.name}: ${result} spawned`);
                            if(message.guild.member(dragID)) message.client.channels.get(pokecordLogID).send(embed);
                        })
                    });
                }
            }
        });

        if(message.content.startsWith('Congratulations')){
            let Spawn = await LastSpawns.findOne({channelID: message.channel.id}).catch(err => console.log(err));

            if(Spawn){
                Spawn.capturedBy = message.mentions.users.first().username;
                Spawn.save().catch(err => console.log(err));
            }
        }
    }
}
