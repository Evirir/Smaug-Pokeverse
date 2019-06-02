const Discord = require('discord.js');
const {getMentionUser, extract} = require('../../helper.js');
const GraphUser = require('../../models/graphUser.js');

module.exports = {
	name: 'addmoney',
	description: `Adds money (for dev's testing).`,
    aliases: ['am'],
	args: true,
    usage: `[amount] [@mentionUser/userTag#1234/userID]`,
	dev: true,

	async execute(message, args){
        const addedCoins = parseInt(args[0]);
		const target = getMentionUser(message, 1, 1);
		if(!target) return message.reply(`I couldn't find that user.`);

        const targetUser = await GraphUser.findOne({userID: target.id}).catch(err => console.log(err));

		if(!targetUser) return message.channel.send(`That user hasn't joined the game yet!`);

		targetUser.money += addedCoins;
        targetUser.save().catch(err => console.log(err));

		let embed = new Discord.RichEmbed()
		.setAuthor(`Added ${addedCoins} to ${target.tag}'s hoard!`, target.displayAvatarURL)
		.setColor('GREEN')
        .addField("Balance", targetUser.money, true);

		return message.channel.send(embed);
	}
};
