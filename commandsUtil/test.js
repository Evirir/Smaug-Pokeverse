const Discord = require('discord.js');

module.exports = {
	name: `test`,
	description: `Test new features. Dev only.`,
	dev: true,

	execute(message, args){
		if(args.length < 2) return message.reply(`not enough arguments!`);
		message.reply(args[0] < args[1]);
  	}
};
