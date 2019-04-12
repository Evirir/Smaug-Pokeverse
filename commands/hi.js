module.exports = {
	name: 'hi',
	description: 'Greets you',
	aliases: ['hello','hey','rytsas'],

	execute(message, args) {
		message.channel.send(`Rytsas ${message.author}! Have a rawrnderful day!`);
	}
};
