const fs = require('fs');
const Discord = require('discord.js');
const Pokemons = require('../Pokemons/Pokemons.json');

module.exports = {
    name: 'pw',
    description: 'Add pokemons to your wishlist',
    aliases: ['pkw','pwl','pkwish'],
    usage: `(add/remove) [pokemon1] [pokemon2] ...`,
    notes: `Seperate your pokemons by spaces, not commas!`,
    wip: true,

    execute(message, args) {
        let Wishlist = JSON.parse(fs.readFileSync('./Pokemons/wishlist.json','utf8'));

        if(!Wishlist[message.author.id]){
            Wishlist[message.author.id] = {
                wishes: []
            }
        }

        if(!args.length || !['add','remove'].includes(args[0])) {

            let tgt = message.mentions.users.size ? message.mentions.users.first().id : message.author.id;
            let desc = "";
            Wishlist[message.author.id].wishes.forEach( p => {
                desc += `${p} \n`;
            });

            let embed = new Discord.RichEmbed()
            .setTitle(`${message.client.users.get(tgt).tag}'s wishlist:`)
            .setThumbnail(message.client.users.get(tgt).displayAvatarURL);

            if(!Wishlist[tgt].wishes.length) embed.setDescription(`It's empty. As empty as my stomach. Grrr I'm hungry.`);
            else embed.setDescription(desc);

            return message.channel.send(embed);
        }

        if(args[0] === 'add') {
            if(args.length === 1){
                let embed = new Discord.RichEmbed()
                .setAuthor(`${message.author.tag}, no Pokemon specified!`, message.author.displayAvatarURL)
                .setDescription(`Arceus needs them to grant your wishes!`);

                return message.channel.send(embed);
            }

            for(var i=1; i<args.length; i++){
                if(!Pokemons.includes(args[i])){
                    let embed = new Discord.RichEmbed()
                    .setAuthor(`${message.author.tag}, **${args[i]}** is not a real Pokemon!`, message.author.displayAvatarURL)
                    .setColor('RED');

                    return message.channel.send(embed);
                }
            }

            for(var i=1; i<args.length; i++){
                Wishlist[message.author.id].push(args[i]);
            }

            fs.writeFile('./Pokemons/wishlist.json', JSON.stringify(Wishlist), (err) => {
                if(err) console.log(err);
            });

            let embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.tag}, wishlist updated!`, message.author.displayAvatarURL)
            .setColor('GREEN');

            return message.channel.send(embed);
        }

        if(args[0] === 'remove') {
            if(args.length === 1){
                let embed = new Discord.RichEmbed()
                .setAuthor(`${message.author.tag}, no Pokemon specified!`, message.author.displayAvatarURL)
                .setDescription(`Arceus needs them to update your wishes!`);

                return message.channel.send(embed);
            }

            let removeList = [];
            for(var i=1; i<args.length; i++){
                removeList.push(args[i]);
            }

            Wishlist[message.author.id].filter( (name) => {
                if(removeList.includes(name)) return false;
                return true;
            });

            fs.writeFile('./Pokemons/wishlist.json', JSON.stringify(Wishlist), (err) => {
                if(err) console.log(err);
            });

            let embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.tag}, wishlist updated!`, message.author.displayAvatarURL)
            .setColor('GREEN');

            return message.channel.send(embed);
        }
    }
};
