const Discord = require('discord.js');
const GraphUser = require('../../models/graphUser.js');
const {msToTime, DayinMS} = require('../../helper.js');

const dailyReward = 1000;

module.exports = {
	name: 'daily',
	description: `Claims your daily reward.`,
    aliases: ['day','d'],

	async execute (message, args) {
        let graphUser = await GraphUser.findOne({userID: message.author.id}).catch(err => console.log(err));
        if(!graphUser) return console.log(`No graphUser data found: daily.js; userID: ${message.author.id}`);

        let now = new Date();
        let diffTime = graphUser.nextDaily.getTime() - now.getTime();

        if(diffTime > 0){
            const embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.username}, your next daily claim:`, message.author.displayAvatarURL)
            .setDescription(msToTime(diffTime));

            return message.channel.send(embed);
        }

        graphUser.money += dailyReward;
		now.setDate(now.getDate() + 1);
		graphUser.nextDaily = now;
        await graphUser.save().catch(err => console.log(err));

        const embed = new Discord.RichEmbed()
        .setAuthor(`Daily reward claimed: ${dailyReward} coins`, message.author.displayAvatarURL)
        .setDescription(`You now have ${graphUser.money}💰.`)
        .setColor('ORANGE');

        message.channel.send(embed);
	}
};
