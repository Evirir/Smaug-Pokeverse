module.exports = {
	name: 'ping',
	description: 'Sends the current ping',
	
	execute(message, args) {
		message.channel.send(`Pong! Still learning how to do this...`);
	}
};
