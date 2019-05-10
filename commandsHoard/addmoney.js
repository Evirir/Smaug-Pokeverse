const Discord = require('discord.js');
const mongoose = require('mongoose');

const Money = require('../models/money.js');

module.exports = {
	name: 'addmoney',
	description: `Adds money (for dev's testing).`,
    aliases: ['am'],
    hoard: true,
	args: true,
    usage: `@mentionUser [amount]`,

	execute(message, args){
		if(!message.mentions.users.size) return message.reply(`you must mention a user to add coins to.`);
        const target = message.mentions.users.first();
        const addedCoins = parseInt(args[1]);
        Money.findOne({
            userID: target.id
        }, (err, money) => {
			if(err) return console.log(err);

			if(!money) return message.channel.send(`That user hasn't joined the game yet!`);

			money.money += addedCoins;
            money.save().catch(err => console.log(err));

			let embed = new Discord.RichEmbed()
			.setAuthor(`Added ${addedCoins} to ${target.tag}'s hoard!`, target.displayAvatarURL)
			.setColor('GREEN')
            .addField("Balance", money.money, true);

			return message.channel.send(embed);
        });
	}
};
