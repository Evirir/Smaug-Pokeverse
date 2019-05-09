const fs = require('fs');
const Discord = require('discord.js');
const {bot_name} = require('./config.json');
const {dragID,godID,dragTag,pokecordID,pokespawnsID} = require('./specificData/users.json');
const {consoleID, messageID} = require('./specificData/channels.json');

///Pokemon
const db = require('./pokemons/pokemons.json');
const imghash = require('imghash');
const request = require('request').defaults({ encoding: null });

const mongoose = require('mongoose');
const {uri} = require('./config.json');
const LastSpawn = require('./models/pokemonLastSpawn.js');
const Prefix = require('./models/prefix.js');

module.exports = {
    execute(client, message) {
        mongoose.connect(uri, {useNewUrlParser: true}).catch(err => console.log(err));
        //POKEASSISTANT
        if (message.author.id === pokecordID) {

            message.embeds.forEach((e) => {
                if (e.description !== undefined && e.description.startsWith("Guess the pokémon and type")) {
                    if (e.image) {
                        let url = e.image.url;

                    request(url, async function(err, res, body) {
                        if (err !== null) return;

                        imghash
                            .hash(body)
                            .then(hash => {
                                let result = db[hash];

                                if (result === undefined) {
                                    let embed = new Discord.RichEmbed()
      		                        .setColor(0xFF4500)
                                    .setTitle("Pokemon Not Found")
                                    .setDescription(`Please contact the owner ${dragTag} to add this Pokemon to the database.`);
                                    return message.channel.send(embed);
                                }

                                PokemonSpawns[message.channel.id] = {
                                    name: result,
                                    caught: false,
                                };

                                fs.writeFile('./Pokemons/lastPokemon.json', JSON.stringify(PokemonSpawns), (err) => {
                                    if(err) console.log(err);
                                });

                                console.log(`${message.guild.name}/${message.channel.name}: ${result} spawned`);
                                message.client.channels.get(pokespawnsID).send(`${message.guild.name}/${message.channel.name}: ${result} spawned`);

                                Wishlist.forEach( user => {
                                    if(user.wishes.includes(result)){
                                        message.channel.send(`Wished by <@${user}>`);
                                        message.channel.send(`<@${user}>`);
                                    }
                                });
                            })
                        });
                    }
                    return;
                }
            });

            if(message.content.startsWith('Congratulations') && PokemonSpawns[message.channel.id]){
                PokemonSpawns[message.channel.id] = {
                    name: PokemonSpawns[message.channel.id].name,
                    caught: true,
                    person: message.mentions.users.first().tag
                };

                fs.writeFile('./Pokemons/lastPokemon.json', JSON.stringify(PokemonSpawns), (err) => {
                    if(err) console.log(err);
                });
            }
        }
        //POKEASSISTANT END

        if(message.author.bot) return;

        let prefix = ',,';
        Prefix.findOne({serverID: message.guild.id}, (err, p) => {
            if(err) return console.log(err);
            if(!p) console.log(`No guild prefix found: Default prefix will be used. (triggers.js) o.=.o`);
            prefix = p;
        });

        //EVIRIR IS MENTIONED
        if (message.isMentioned(client.users.get(dragID))){
            if(message.author.id === dragID) return;
            if(message.author.id === godID){
                return message.channel.send(`<@${message.author.id}>, ya' calling Evirir-sama?`);
                return message.client.channels.get(messageID).send(`<@${message.author.id}> mentioned you in ${message.guild.name}/${message.channel.name}:\n${message.content}`);
            }
            else
                message.channel.send(`Did someone call Evirir-sama...? I'll get him!`);
                return message.client.channels.get(messageID).send(`<@${message.author.id}> mentioned you in ${message.guild.name}/${message.channel.name}:\n${message.content}`);
        }

        //BOT SELF IS MENTIONED
        if (message.isMentioned(client.user) || message.content.toLowerCase().includes(`${bot_name}`)) {
            const msg = message.content.toLowerCase();

            if(msg.includes(`what do you do`) || msg.includes(`what can you do`))
                return message.channel.send(`I can perform magic spells that Evirir have taught me, such as spamming people, teleporting, responding to my name and eating cookies ~~and deleting the whole channel~~.\nType \`${prefix}help\` for more on what I can do!`);
            if(msg.includes(`how are you`))
                return message.channel.send(`I'm fine, <@${message.author.id}>`);
            if(msg.includes(`good`))
                return message.channel.send(`Thanks! **licks your face**`);
            if(msg.includes(`cookie`))
                return message.channel.send(`**noms cookie**`);
            if(msg.includes(`help`))
                return client.commands.get('help').execute(message,[]);

            if(message.author === (client.users.get(dragID))){
                if(msg.includes(`hey`) || msg.includes(`hi`) || msg.includes(`rytsas`) || msg.includes(`hewwo`))
                    return message.reply(`Hey! **snuggles you**`);
                if(msg.includes(`thank you`) || msg.includes(`thanks`))
                    return message.channel.send(`You're welcome <@${dragID}>! **licks you**`);
                return message.channel.send(`Evirir-sama you came! **leaps around you happily**`);
            }

            if(message.author === (client.users.get(godID))){
                if(msg.includes(`hey`) || msg.includes(`hi`) || msg.includes(`rytsas`) || msg.includes(`hewwo`))
                    return message.channel.send(`Hey <@${godID}>...will I become a powerful dragon wizard in the future?`);
                if(msg.includes(`thank you`) || msg.includes(`thanks`))
                    return message.channel.send(`Y-you're welcome! Always under your wings, <@${godID}>...`);
                return message.channel.send(`<@${godID}>...**offers cookies respectfully**\nThere you go, more tasty cookies I found from Earth.`);
            }

            if(msg.includes(`hey`) || msg.includes(`hi`) || msg.includes(`rytsas`) || msg.includes(`hewwo`))
                return message.channel.send(`Hrrr, <@${message.author.id}>! Do you have any cookies?`);
            if(msg.includes(`thank you`) || msg.includes(`thanks`))
                return message.reply(`you're welcome! **takes your cookies** ...but for what?`);
            return message.reply(`I'm here~ **wags tail**`);
        }

        //MESSAGE CONTAINS TRIGGER
        const msg = message.content.toLowerCase();

        if(msg.includes('good dragon'))
            return message.channel.send(`Thanks! **licks your face**`);
        if(msg.includes('dragon'))
            return message.channel.send(`Did someone say...**DRAGON**?`);
        if(msg.includes(`rawr`))
            return message.channel.send('*ghrr*');
        if(msg.includes(`grr`) || msg.includes(`ghrr`))
            return message.channel.send('*rawr*');
        if(msg === 'owo')
            return message.channel.send(`uwu`);
        if(msg === 'uwu')
            return message.channel.send(`owo`);
        if(msg === 'wew')
            return message.channel.send(`lad`);
    }
};
