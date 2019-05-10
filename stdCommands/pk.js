const Discord = require('discord.js');
const mongoose = require('mongoose');
const pokemonLastSpawn = require('../models/pokemonLastSpawn.js');

module.exports = {
    name: 'pk',
    description: 'Displays the last pokemon spawned by Pokecord in this channel',
    aliases: ['pname','poke'],

    async execute(message, args) {
        const spawn = await pokemonLastSpawn.findOne({channelID: message.channel.id}).catch(err => console.log(err));

        if(!spawn.lastSpawn){
            let embed = new Discord.RichEmbed()
            .setTitle(`Last Pokemon not detected yet!`)
            .setColor(0xFF4500)
            .setFooter("Shamelessly copy-pasted most of PokeAssistant's code, by Evirir The Blue");
            return message.channel.send(embed);
        }

        let add = spawn.capturedBy ? ` [caught by ${spawn.capturedBy}]` : "";

        let embed = new Discord.RichEmbed()
        .setTitle("Last spawned pokemon: " + spawn.lastSpawn + add)
        .setFooter("Shamelessly copy-pasted most of PokeAssistant's code, by Evirir The Blue");

        if(spawn.capturedBy) embed.setColor(0xFF4500);
        else embed.setColor('GREEN')

        message.channel.send(embed);
    }
};
