const mongoose = require('mongoose');
const Settings = require('../models/serverSettings.js');
const {getMentionUser} = require('../helper.js');

module.exports = {
	name: `dm`,
	description: `Delivers a DM message to mentioned user via a dragon courier.`,
	aliases: [`pm`,`msg`,`message`,`private`],
	args: true,
	usage: `@mentionUser [message]`,
	notes: `The receiver will see your name.`,

	async execute(message, args){
		let prefix = ",,";
		let p = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(!p) console.log(`No guild prefix found: dm.js`);
		prefix = p.prefix;

		if(!message.mentions.users || !message.mentions.users.size) return message.channel.send(`Please specify the target user.`);

		let msg = message.content;

		msg = msg.substring(msg.indexOf(/\s+/) + 1;);

		start = msg.indexOf(" ") + 1;
		if(start == 0) return message.reply(`please specify your message!`);
		msg = msg.substring(start);

		message.channel.send(`<@${message.author.id}>, message sent to mentioned user!`);
		message.client.users.get(userID).send(`**${message.author.username}** said:\n` + msg);
	}
};
