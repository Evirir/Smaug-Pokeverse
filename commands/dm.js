const {prefix} = require(`../config.json`);
const {consoleID} = require(`../channels.json`);

module.exports = {
	name: `dm`,
	description: `Delivers a DM message to mentioned user via a dragon courier.`,
	aliases: [`pm`,`msg`,`message`,`private`],
	args: true,
	usage: `@mentionUser [message]`,
	notes: `The receiver will see your name`,

	execute(message, args){
		if(!message.mentions.users.size) return message.reply(`please mention someone before inputting your message!\nUsage: \`${prefix}dm @mentionUser [message]\``);

		var msg = message.content;

		//trims ..dm command
		var start = msg.indexOf(" ")+1;
		msg = msg.substring(start, msg.length);

		//trims @mentionuser, and checks if there's a message
		start = msg.indexOf(" ")+1;
		if(start==0) return message.reply(`please specify your message!`);
		msg = msg.substring(start, msg.length);

		message.channel.send(`<@${message.author.id}>, message sent to mentioned user!`);
		message.client.users.get(message.mentions.users.first().id).send(`**${message.author.tag}** said:\n` + msg);
		message.client.channels.get(consoleID).send(`**${message.author.tag}** said to **${message.mentions.users.first().tag}**:\n` + msg);
	}
};
