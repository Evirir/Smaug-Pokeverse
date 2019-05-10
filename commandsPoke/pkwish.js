const Discord = require('discord.js');
const Pokemons = require('../pokemons/pokemons.json');
const mongoose = require('mongoose');
const Wishlist = require('../models/wishlist.js');

module.exports = {
    name: 'pkwish',
    description: 'View your Pokecord wishlist.',
    aliases: ['pw','wl'],
    poke: true,
    wip: true,

    execute(message, args) {
        const w = Wishlist.findOne({channelID: message.channel.id}).catch(err => console.log(err));

        if(!w){
            let embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.tag}'s wishlist`, message.author.displayAvatarURL)
            .setColor(0xFF4500)
            .setTitle(`Your wishlist is empty. Use ,,wishadd [pokemon] to add a pokemon to your wishlist.`);

            return message.channel.send(embed);
        }

        let wish = "";

        let embed = new Discord.RichEmbed()
        .setAuthor(`${message.author.tag}'s wishlist`, message.author.displayAvatarURL)
        .setDescription(list)
        .setColor('GREEN');

        message.channel.send(embed);
    }
};
