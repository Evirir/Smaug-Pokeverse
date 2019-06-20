const Settings = require('../../models/serverSettings.js');
const {getMentionUser, extract} = require('../../helper.js');

module.exports = {
	name: `dm`,
	description: `Delivers a DM message to mentioned user via a dragon courier.`,
	aliases: [`pm`,`msg`,`message`,`private`],
	args: true,
	usage: `[user] [message]`,
	notes: `The receiver will see your name.`,

	async execute(message, args, prefix){
		if(!message.mentions.users || !message.mentions.users.size) return message.channel.send(`Please specify the target user.`);

		let msg = message.content;

		msg = msg.substring(msg.indexOf(/\s+/) + 1);

		let targetUser = getMentionUser(message, 0, 0);
		if(!targetUser) return message.reply(`please mention a valid user!`);

		msg = extract(message, 1);

		message.reply(`message sent to mentioned user!`);
		targetUser.send(`**${message.author.username}** said:\n${msg}`);
	}
};
