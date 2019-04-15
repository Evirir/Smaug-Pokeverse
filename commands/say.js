const {prefix} = require(`../config.json`);
const {dragID} = require(`../users.json`);
const {isoAdminID} = require(`../roles.json`);
const {consoleID} = require(`../channels.json`);

module.exports = {
	name: 'say',
	description: `Echos what you said\n`,
	aliases: [`echo`],
	args: true,
	usage: `[message]`,

	execute(message, args){
		var permission = true; //can change depends on future
		if(!permission){
			return message.reply(`you don't have the permission to use this! Tell Evirir-sama and maybe he'll give you the permission...`);
		}
		let msg = message.content;
		let start = msg.indexOf(" ")+1;
		msg = msg.substr(start, msg.length-start);
		message.channel.bulkDelete(1, true);
		message.channel.send(msg);
		message.client.channels.get(consoleID).send(`**${(message.author.id === dragID? `You`: `<@`+message.author.id+`>`)}** used \`say\` at <#${message.channel.id}>:\n${msg}`);
  	}
};
