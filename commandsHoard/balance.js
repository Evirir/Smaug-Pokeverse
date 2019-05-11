const Discord = require('discord.js');
const mongoose = require('mongoose');

const Money = require('../models/money.js');

module.exports = {
	name: 'balance',
	description: `Check someone's balance.`,
    aliases: ['bal'],
    hoard: true,
    usage: `@mentionUser/userTag`,

	async execute(message, args){
		let target;
        if(args.length) target = getMentionUser(message.client, args[0]) || message.author;
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
		.setColor('GOLD');

		if(target === message.author) embed.setAuthor(`You have ${money.money} coins.`, target.displayAvatarURL);
		else embed.setAuthor(`${target.username} has ${money.money} coins.`, target.displayAvatarURL)

		message.channel.send(embed);
	}
};
