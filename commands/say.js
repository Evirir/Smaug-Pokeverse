const {dragID,drag2ID} = require(`../users.json`);
const {isoAdminID} = require(`../roles.json`);

module.exports = {
	name: 'say',
	description: `Echos what the dragon said\nYes, **only DRAGONS** may use this. ò.=.ó`,
	aliases: [`echo`],
	args: true,
	usage: `[message]`,

	execute(message, args){
		if(!(message.author.id === dragID || message.author.id === drag2ID || message.member.roles.find(r => r.name.includes(`dragon`)) || message.member.roles.find(r => r.id === isoAdminID)) ){
			message.reply(`you don't have the permission to use this! Tell Evirir-sama and maybe he'll give you the permission...`);
			return;
		}
		let msg = message.content;
		let front = prefix.length + 4;
		let n = msg.length - front;
		msg = msg.substr(front,n);
		message.channel.bulkDelete(1, true);
		message.channel.send(msg);
  	}
};
