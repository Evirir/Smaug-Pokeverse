const {dragID} = require(`../users`);

module.exports = {
	name: 'report',
	description: 'Delivers a DM letter to <@${dragID}> via a dragon courier.',
	aliases: [`dm`],
	arg: true,
	usage: `[message]`,

	execute(message, args) {
		message.channel.send(`A dragon courier flies towards you, and carefully writes down your message...\nMessage sent to Evirir!`);
		message.channel.users.get(dragID).send(`A dragon courier brought a message to you!\n${message.author.name} said: ${message.content}`);
	}
};
