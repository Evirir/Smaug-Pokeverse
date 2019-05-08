const Discord = require('discord.js');
const mongoose = require('mongoose');
const Money = require('../models/money.js');

module.exports = {
	name: 'balance',
	description: `Check someone's balance`,
    aliases: ['bal'],
    hoard: true,
    usage: `@mentionUser`,

	execute(message, args){
		mongoose.connect('mongodb+srv://Evirir:%40%24dfGhjkl%31%32%33@smaug-uq5av.mongodb.net/Currency?retryWrites=true', {useNewUrlParser: true}).catch(err => console.log(err));

        const target = message.mentions.users.first() || message.author;
        Money.findOne({
            userID: target.id
        }, (err, money) => {
			if(err) return console.log(err);

			let moneyValue = 1000;
			if(money) moneyValue = money.money;

			let embed = new Discord.RichEmbed()
			.setColor('GOLD');

			if(target === message.author) embed.setAuthor(`You have ${moneyValue} coins.`, target.displayAvatarURL);
			else embed.setAuthor(`${target.tag} has ${moneyValue} coins.`, target.displayAvatarURL)

			message.channel.send(embed);
        });
	}
};