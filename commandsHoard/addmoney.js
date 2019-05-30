const Discord = require('discord.js');
const mongoose = require('mongoose');
const {getMentionUser, extract} = require('../helper.js');
const Money = require('../models/money.js');

module.exports = {
	name: 'addmoney',
	description: `Adds money (for dev's testing).`,
    aliases: ['am'],
    hoard: true,
	args: true,
    usage: `[@mentionUser/userTag#2212/userID] [amount]`,
	dev: true,

	async execute(message, args){
        const addedCoins = parseInt(args[0]);
		const target = getMentionUser(message, 1, 1);
		if(!target) return message.reply(`I couldn't find that user.`);

        const money = await Money.findOne({userID: target.id}).catch(err => console.log(err));

		if(!money) return message.channel.send(`That user hasn't joined the game yet!`);

		money.money += addedCoins;
        money.save().catch(err => console.log(err));

		let embed = new Discord.RichEmbed()
		.setAuthor(`Added ${addedCoins} to ${target.tag}'s hoard!`, target.displayAvatarURL)
		.setColor('GREEN')
        .addField("Balance", money.money, true);

		return message.channel.send(embed);
	}
};
