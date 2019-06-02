module.exports = {
	name: `restart`,
	description: `Restarts the bot. Type ,,restart confirm`,
    args: true,
    usage: `confirm`,
    dev: true,

	execute(message, args) {
        if(args[0] !== `confirm`) return message.channel.send(`${message.author} ,,restart confirm`);

        message.channel.send(`Bot will restart.`);
        process.exit();
	}
};
