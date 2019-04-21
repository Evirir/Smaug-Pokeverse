const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'pk',
    description: 'Displays the last pokemon spawned by Pokecord in this channel',
    aliases: ['pname','poke'],

    execute(message, args) {
        let PokemonSpawns = JSON.parse(fs.readFileSync('./lastPokemon.json','utf8'));

        if(!PokemonSpawns[message.channel.id])
            return message.channel.send(`Last Pokemon not detected yet!`);

        let embed = new Discord.RichEmbed()
  		.setColor(0xFF4500)
        .setTitle("Last spawned pokemon: " + PokemonSpawns[message.channel.id].name)
        .setFooter("Shamelessly copy-pasted most of PokeAssistant's code, by Evirir The Blue");

        message.channel.send(embed);
    }
};
