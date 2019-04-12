const {prefix} = require(`../config.json`);

module.exports = {
	name: 'say',
	description: `Echos what the dragon said\nYes, **only DRAGONS** may use this. ò.=.ó`,
	aliases: [`echo`],
	args: true,
	usage: `[message]`,

	execute(message, args){
		let msg = message.content;
		let front = prefix.length + 4;
		let n = msg.length - front;
		msg = msg.substr(front,n);
		message.channel.bulkDelete(1, true);
		message.channel.send(msg);
  	}
};
