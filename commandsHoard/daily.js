const Discord = require('discord.js');
const mongoose = require('mongoose');
const Money = require('../models/money.js');
const {msToTime, DayinMS} = require('../helper.js');

const dailyReward = 1000;

module.exports = {
	name: 'daily',
	description: `Claims your daily reward.`,
    aliases: ['day','d'],
    hoard: true,

	async execute (message, args) {
        let money = await Money.findOne({userID: message.author.id}).catch(err => console.log(err));
        if(!money) return console.log(`No Money data found: daily.js; userID: ${message.author.id}`);

        let now = new Date();
        let diffTime = money.nextDaily.getTime() - now.getTime();

        if(diffTime > 0){
            const embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.username}, your next daily claim:`, message.author.displayAvatarURL)
            .setDescription(msToTime(diffTime));

            return message.channel.send(embed);
        }

        money.money += dailyReward;
		now.setDate(now.getDate() + 1);
		money.nextDaily = now;
        await money.save().catch(err => console.log(err));

        const embed = new Discord.RichEmbed()
        .setAuthor(`Daily reward claimed: ${dailyReward}💰`, message.author.displayAvatarURL)
        .setDescription(`You now have ${money.money}💰.`)
        .setColor('ORANGE');

        message.channel.send(embed);
	}
};
