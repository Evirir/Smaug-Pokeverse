const {dragID} = require(`../users`);

module.exports = {
	name: 'report',
	description: 'Delivers a DM letter to <@${dragID}> via a dragon courier.',
	aliases: [`dm`],
	arg: true,
	usage: `[message]`,

	execute(message, args) {
		message.channel.users.get(dragID).send(`A dragon courier brought a message to you!\n${message.author.name} said: ${message.content}`);
	}
};
