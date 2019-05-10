const Discord = require('discord.js');
const Pokemons = require('../pokemons/pokemons.json');
const mongoose = require('mongoose');
const Wishlist = require('../models/wishlist.js');
const Settings = require('../models/serverSettings.js');

module.exports = {
    name: 'pkwish',
    description: 'View your Pokecord wishlist.',
    aliases: ['pw','wl','pkw'],
    poke: true,

    async execute(message, args) {
        let w = await Wishlist.findOne({userID: message.author.id}).catch(err => console.log(err));
        let s = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!s) return console.log(`No guild settings found: pkwishremove`);

        if(!w || !w.wishlist.length){
            let embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.username}'s wishlist`, message.author.displayAvatarURL)
            .setColor('RED')
            .setTitle(`Your wishlist is empty.`)
            .setDescription(`Use ${s.prefix}pkwishadd [pokemon] to add a pokemon to your wishlist.`)

            return message.channel.send(embed);
        }

        let list = "";
        w.wishlist.forEach(p => {
            list += p + '\n';
        });

        let embed = new Discord.RichEmbed()
        .setAuthor(`${message.author.username}'s wishlist`, message.author.displayAvatarURL)
        .setDescription(list)
        .setColor('GOLD');

        message.channel.send(embed);
    }
};
