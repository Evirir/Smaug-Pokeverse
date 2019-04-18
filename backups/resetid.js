const {botToken} = require(`../config.json`);
var fs = require('fs');

module.exports = {
	name: `resetid`,
	description: `Resets my identity`,
	dev: true,
	hidden: true,

	execute(message, args) {
		fs.writeFileSync(`status.txt`,`smaug`);

		message.channel.send(`<@${message.author.id}>, identity has been reset.`);
		message.client.destroy();
	}
};
