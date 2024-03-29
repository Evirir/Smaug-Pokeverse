const Discord = require('discord.js');
const {getMentionUser} = require('../../helper.js');
const GraphUser = require('../../models/graphUser.js');

module.exports = {
	name: 'balance',
	description: `Check someone's balance.`,
    aliases: ['bal'],
    usage: `[target]`,

	async execute(message, args){
		let target = message.author;
        if(args.length) target = getMentionUser(message, 0) || message.author;

		let graphUser = await GraphUser.findOne({userID: target.id}).catch(err => console.log(err));
		if(!graphUser){
        	graphUser = newgraphUser(target, 0);
        	await graphUser.save().catch(err => console.log(err));
        }

		let embed = new Discord.RichEmbed()
		.setColor('GOLD');

		if(target === message.author) embed.setAuthor(`You have ${graphUser.money} coins.`, target.displayAvatarURL);
		else embed.setAuthor(`${target.username} has ${graphUser.money} coins.`, target.displayAvatarURL)

		message.channel.send(embed);
	}
};
