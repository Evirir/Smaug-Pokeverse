const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'pw',
    description: 'Add pokemons to your wishlist',
    aliases: ['pkw','pkwish','pwish'],
    args: true,
    usage: `[pokemon1] [pokemon2] ...`,
    notes: `Seperate your pokemons by spaces, not commas!`,

    execute(message, args) {
        let PokemonSpawns = JSON.parse(fs.readFileSync('./Pokemons/lastPokemon.json','utf8'));

        if(!PokemonSpawns[message.channel.id]){
            let embed = new Discord.RichEmbed()
            .setTitle(`Last Pokemon not detected yet!`)
            .setColor(0xFF4500)
            .setFooter("Shamelessly copy-pasted most of PokeAssistant's code, by Evirir The Blue");

            return message.channel.send(embed);
        }

        let add = PokemonSpawns[message.channel.id].caught ? ` [caught by ${PokemonSpawns[message.channel.id].person}]` : "";

        let embed = new Discord.RichEmbed()
        .setTitle("Last spawned pokemon: " + PokemonSpawns[message.channel.id].name + add)
        .setFooter("Shamelessly copy-pasted most of PokeAssistant's code, by Evirir The Blue");

        if(PokemonSpawns[message.channel.id].caught) embed.setColor(0xFF4500);
        else embed.setColor('GREEN')

        message.channel.send(embed);
    }
};
