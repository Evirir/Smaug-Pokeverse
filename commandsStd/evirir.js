const {dragID, gitLink} = require(`../specificData/users.json`);

module.exports = {
	name: 'evirir',
	description: `Want to know more about Evirir-sama? Send this!`,
	aliases: [`author`, `owner`, `creator`, `dev`],

	execute(message, args) {
		let msg = "";
		msg += `Evirir-sama is my teacher and friend who taught me everything. \\o.=.o/\n`;
		msg += `His dream is to become a dragon someday! o.=.o\n`;
		msg += `Feel free to give suggestions! He'll always be happy with them\n\n`;
		msg += `Discord tag: ${message.client.users.get(dragID).tag}\n`;
		msg += `GitHub: ${gitLink}`;
		message.channel.send(msg);
	}
};
