const mongoose = require('mongoose');
const Settings = require('../models/serverSettings.js');

module.exports = {
	name: `dm`,
	description: `Delivers a DM message to mentioned user via a dragon courier.`,
	aliases: [`pm`,`msg`,`message`,`private`],
	args: true,
	usage: `@mentionUser [message]`,
	notes: `The receiver will see your name.`,

	execute(message, args){
		let prefix = ",,";
		let p = Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(!p) console.log(`No guild prefix found: dm.js`);
		prefix = p.prefix;

		let userID = "";
		let usertag = "";
		if(message.mentions.users.size) userID = message.mentions.users.first().id;
		else userID = args[0];
		usertag = message.client.users.get(userID).tag;

		try{
			var msg = message.content;

			//trims ..dm command
			var start = msg.indexOf(" ") + 1;
			msg = msg.substring(start);

			//trims @mentionuser, and checks if there's a message
			start = msg.indexOf(" ") + 1;
			if(start == 0) return message.reply(`please specify your message!`);
			msg = msg.substring(start);

			message.channel.send(`<@${message.author.id}>, message sent to mentioned user!`);
			message.client.users.get(userID).send(`**${message.author.tag}** said:\n` + msg);
		}
		catch(error){
			message.reply(`please mention someone before inputting your message!\nUsage: \`${prefix}dm @mentionUser/userID [message]\``);
		}
	}
};
