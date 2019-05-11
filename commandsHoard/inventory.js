const Discord = require('discord.js');
const mongoose = require('mongoose');
const Money = require('../models/money.js');
const {getMentionUser} = require('../helper.js');

module.exports = {
    name: 'inventory',
    description: 'Checks someone\'s inventory.',
    aliases: ['i','inv'],
    hoard: true,

    async execute (message, args) {
        let target = "";
        if(args[0]) target = getMentionUser(args[0]) || message.author;
        else target = message.author;

        let money = await Money.findOne({userID: target.id}).catch(err => console.log(err));
        if(!money) return console.log(`No Money data found: inventory.js; userID: ${message.author.id}`);

        let embed = new Discord.RichEmbed()
        .setAuthor(`${target.username}'s hoard`, target.displayAvatarURL)
        .setColor('GOLD')
        .addField(`Coins`, `${money.money}💰`);

        money.inventory.forEach(item => {
            embed.addField(`${item.name} x${item.amount}`);
        });

        message.channel.send(embed);
	}
};
