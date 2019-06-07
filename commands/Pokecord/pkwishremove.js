const Discord = require('discord.js');
const PokemonNames = require('../../pokemons/pokemonNames.json');
const Wishlist = require('../../models/wishlist.js');
const Settings = require('../../models/serverSettings.js');

function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   return splitStr.join(' ');
}

module.exports = {
    name: 'pkwishremove',
    description: 'Removes a Pokémon from your Pokecord wishlist.',
    aliases: ['wishremove','pwremove','wlremove','pwr','wlr'],

    async execute(message, args) {
        let w = await Wishlist.findOne({userID: message.author.id}).catch(err => console.log(err));
        let s = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!s) return console.log(`No guild prefix found: pkwishremove.js`);

        if(!w || !w.wishlist.length){
            let embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.username}, your wishlist is empty!`, message.author.displayAvatarURL)
            .setColor('RED');

            return message.channel.send(embed);
        }

        let removedPokemon = titleCase(message.content.substring(message.content.indexOf(" ") + 1));

        let L = 0, R = w.wishlist.length - 1, m = 0, ans = 0;
        let found = false;
        while(L<=R) {
            m = Math.floor((L+R)/2);
            if(w.wishlist[m] === removedPokemon){
                found = true;
                ans = m;
                break;
            }
            if(w.wishlist[m] < removedPokemon) L = m + 1;
            else R = m - 1;
        }

        if(!found){
            let embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.username}, this Pokémon is not in your wishlist, or it does not exist!`, message.author.displayAvatarURL)
            .setColor('RED');

            return message.channel.send(embed);
        }

        w.wishlist.splice(ans, 1);
        w.save().catch(err => console.log(err));

        let wp = await WishlistP.findOne({name: removedPokemon}).catch(err => console.log(err));
        if(!wp){
            let embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.username}, this isn't supposed to happen, please inform <${dragID}> about this. o.=.o"`, message.author.displayAvatarURL)
            .setColor('RED');
        }
        else{
            L = 0, R = wp.wishedBy.length - 1;
            while(L<=R) {
                m = Math.floor((L+R)/2);
                if(wp.wishedBy[m] === message.author.id){
                    await wp.wishedBy.splice(m, 1);
                    break;
                }
                if(wp.wishedBy[m] < message.author.id) L = m + 1;
                else R = m - 1;
            }
            await w.save().catch(err => console.log(err));
        }

        let embed = new Discord.RichEmbed()
        .setAuthor(`${message.author.username}, wishlist updated!`, message.author.displayAvatarURL)
        .setDescription(`Removed Pokémon: **${removedPokemon}**`)
        .setColor('ORANGE');

        message.channel.send(embed);
    }
};
