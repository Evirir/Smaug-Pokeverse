const {dragID} = require(`../users.json`);

module.exports = {
	name: 'say',
	description: `Echos what you said`,
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
  	}
};
