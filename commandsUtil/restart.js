const {dragID} = require(`../specificData/users.json`);

module.exports = {
	name: `restart`,
	description: `Restarts the bot. Type ,,restart confirm`,
    args: true,
    usage: `confirm`,
	util: true,
    dev: true,

	execute(message, args) {
        if(args[0] !== `confirm`) return message.channel.send(`${message.author} ,,restart confirm`);
        process.exit();
	}
};
