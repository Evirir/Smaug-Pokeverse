const Discord = require('discord.js');
const Pokemons = require('../../pokemons/pokemons.json');
const mongoose = require('mongoose');
const Wishlist = require('../../models/wishlist.js');
const Settings = require('../../models/serverSettings.js');

module.exports = {
    name: 'pkwish',
    description: 'Displays your Pokecord wishlist.',
    aliases: ['pw','wl','pkw'],
    usage: `[page] (optional)`,

    async execute(message, args) {
        let targetUser = message.mentions.users.first() || message.author;
        let w = await Wishlist.findOne({userID: targetUser.id}).catch(err => console.log(err));
        let s = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!s) return console.log(`No guild settings found: pkwish.js`);

        if(!w || !w.wishlist.length){
            let embed = new Discord.RichEmbed()
            .setAuthor(`${targetUser.username}'s wishlist`, targetUser.displayAvatarURL)
            .setColor('RED')
            .setTitle(`Your wishlist is empty.`)
            .setDescription(`Use ${s.prefix}pkwishadd [pokemon] to add a pokemon to your wishlist.`)

            return message.channel.send(embed);
        }

        let list = "";
        let currentPage = 0;
        let maxPage = Math.ceil(w.wishlist.length/15.0) - 1;

        if(args.length && !isNaN(args[0])){
            if(args[0] >= 1 && args[0] <= maxPage) currentPage = args[0] - 1;
        }

        for(let i = currentPage*15; i < Math.min((currentPage + 1)*15, w.wishlist.length); i++){
            list += w.wishlist[i] + '\n';
        }

        let embed = new Discord.RichEmbed()
        .setAuthor(`${targetUser.username}'s wishlist`, targetUser.displayAvatarURL)
        .setDescription(list)
        .setColor('GOLD')
        .setFooter(`Page ${currentPage + 1}/${maxPage + 1}`);

        let sent = await message.channel.send(embed);
        await sent.react('⬅');
        await sent.react('➡');

        const filter = (reaction, user) => {
            return user.id === message.author.id && ['⬅','➡'].includes(reaction.emoji.name);
        };

        const collector = sent.createReactionCollector(filter, { time: 3*60000 });

        collector.on('collect', async (reaction, reactionCollector) => {
            await reaction.remove(message.author);

            if(reaction.emoji.name === '⬅'){
                if(currentPage === 0) return;
                currentPage--;
            }
            else{
                if(currentPage === maxPage) return;
                currentPage++;
            }

            list = "";
            for(let i = currentPage*15; i < Math.min((currentPage + 1)*15, w.wishlist.length); i++){
                list += w.wishlist[i] + '\n';
            }

            embed
            .setDescription(list)
            .setFooter(`Page ${currentPage + 1}/${maxPage + 1}`);

            sent.edit(embed);
        });
    }
};
