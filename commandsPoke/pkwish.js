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
        let targetUser = message.mentions.users.first() || message.author;
        let w = await Wishlist.findOne({userID: targetUser.id}).catch(err => console.log(err));
        let s = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!s) return console.log(`No guild settings found: pkwishremove`);

        if(!w || !w.wishlist.length){
            let embed = new Discord.RichEmbed()
            .setAuthor(`${targetUser.username}'s wishlist`, targetUser.displayAvatarURL)
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
        .setAuthor(`${targetUser.username}'s wishlist`, targetUser.displayAvatarURL)
        .setDescription(list)
        .setColor('GOLD');

        message.channel.send(embed);
    }
};
