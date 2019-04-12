module.exports = {
	name: 'hi',
	description: 'Greets you',
	aliases: ['hello','hey'],
	
	execute(message, args) {
		message.channel.send(`Rytsas ${message.author}! Have a rawrnderful day!`);
	}
};
