const {dragID} = require(`../users.json`);

module.exports = {
	name: 'evirir',
	description: `Want to know more about Evirir-sama? Send this!`,
	aliases: [`author`,`owner`],

	execute(message, args) {
		message.channel.send(`I like <@${dragID}> \\o.=.o/`);
	}
};
