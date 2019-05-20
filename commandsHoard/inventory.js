const Discord = require('discord.js');
const mongoose = require('mongoose');
const Money = require('../models/money.js');
const {getMentionUser} = require('../helper.js');

module.exports = {
    name: 'inventory',
    description: 'Checks someone\'s inventory.',
    aliases: ['i','inv'],
    usage: `@mentionUser/userTag`,
    hoard: true,

    async execute (message, args) {
        let target;
        let raw = message.content.slice(message.content.indexOf(' ') + 1).trim();
        if(args.length) target = getMentionUser(message.client, raw) || message.author;
        else target = message.author;

        let money = await Money.findOne({userID: target.id}).catch(err => console.log(err));
        if(!money){
        	let newMoney = new Money({
        		userID: target.id,
        		money: 1000,
        		nextDaily: new Date(),
        		inventory: []
        	});
        	await newMoney.save().catch(err => console.log(err));
            money = newMoney;
        }

        let embed = new Discord.RichEmbed()
        .setAuthor(`${target.username}'s hoard`, target.displayAvatarURL)
        .setColor('GOLD')
        .addField(`Coins`, `${money.money}💰`);

        let list = "";
        money.inventory.forEach(item => {
            list += `${item.name} x${item.amount}\n`;
        });

        embed.addField(`Items`, list);
        message.channel.send(embed);
	}
};
