module.exports = {
	name: `restart`,
	description: `Restarts the bot. Type ,,restart confirm`,
    args: true,
    usage: `confirm`,
    dev: true,

	async execute(message, args) {
        if(args[0] !== `confirm`) return message.channel.send(`${message.author} ,,restart confirm`);

        await message.channel.send(`Restarting bot.`);
        process.exit();
	}
};
