const Discord = require('discord.js');
const PokemonNames = require('../../pokemons/pokemonNames.json');
const {dragID} = require('../../specificData/users.json');
const Wishlist = require('../../models/wishlist.js');
const WishlistP = require('../../models/wishlistPokemon.js');
const Settings = require('../../models/serverSettings.js');

function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   return splitStr.join(' ');
}

module.exports = {
    name: 'pkwishadd',
    description: 'Adds a Pokémon to your Pokecord wishlist.',
    aliases: ['wishadd','pwadd','wladd','pwa','wla'],
    args: true,
    usage: `[pokemon]`,

    async execute(message, args) {
        let w = await Wishlist.findOne({userID: message.author.id}).catch(err => console.log(err));
        let s = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!s) return console.log(`No guild prefix found: pkwishadd.js`);

        if(!w){
            w = new Wishlist({
                userID: message.author.id,
                wishlist: []
            });
        }

        let addedPokemon = titleCase(message.content.substring(message.content.indexOf(" ") + 1));

        let L = 0, R = PokemonNames.length - 1, m = 0;
        let found = false;
        while(L<=R) {
            m = Math.floor((L+R)/2);
            if(PokemonNames[m] === addedPokemon){
                found = true;
                break;
            }
            if(PokemonNames[m] < addedPokemon) L = m + 1;
            else R = m - 1;
        }

        if(!found){
            let embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.username}, this Pokémon does not exist!`, message.author.displayAvatarURL)
            .setColor('RED');

            return message.channel.send(embed);
        }

        L = 0, R = w.wishlist.length - 1;
        let ans = 0;
        while(L<=R) {
            m = Math.floor((L+R)/2);
            if(w.wishlist[m] === addedPokemon){
                let embed = new Discord.RichEmbed()
                .setAuthor(`${message.author.username}, this Pokémon is already in your wishlist!`, message.author.displayAvatarURL)
                .setColor('GOLD');

                return message.channel.send(embed);
            }
            if(w.wishlist[m] < addedPokemon){
                L = m + 1;
                ans = m;
            }
            else R = m - 1;
        }

        w.wishlist.splice(ans + 1, 0, addedPokemon);
        w.save().catch(err => console.log(err));

        let wp = await WishlistP.findOne({name: addedPokemon}).catch(err => console.log(err));
        if(!wp){
            const newWishlistP = new WishlistP({
                name: addedPokemon,
                wishedBy: [message.author.id]
            });
            await newWishlistP.save().catch(err => console.log(err));
        }
        else{
            L = 0, R = wp.wishedBy.length - 1, ans = 0;
            while(L<=R) {
                m = Math.floor((L+R)/2);
                if(wp.wishedBy[m] === message.author.id){
                    let embed = new Discord.RichEmbed()
                    .setAuthor(`${message.author.username}, this isn't supposed to happen, please inform <${dragID}> about this. o.=.o"`, message.author.displayAvatarURL)
                    .setColor('RED');

                    return message.channel.send(embed);
                }
                if(wp.wishedBy[m] < message.author.id){
                    L = m + 1;
                    ans = m;
                }
                else R = m - 1;
            }
            wp.wishedBy.splice(ans + 1, 0, message.author.id);
            await wp.save().catch(err => console.log(err));
        }

        let embed = new Discord.RichEmbed()
        .setAuthor(`${message.author.username}, wishlist updated!`, message.author.displayAvatarURL)
        .setDescription(`Added Pokémon: **${addedPokemon}**`)
        .setColor('GREEN');

        message.channel.send(embed);
    }
};
