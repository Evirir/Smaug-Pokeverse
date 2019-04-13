const {dragID,dragTag,gitLink} = require(`../users.json`);

module.exports = {
	name: 'evirir',
	description: `Want to know more about Evirir-sama? Send this!`,
	aliases: [`author`, `owner`],

	execute(message, args) {
		var msg = "";
		msg += `Evirir-sama is my teacher and friend who taught me everything. \\o.=.o/\n`;
		msg += `His dream is to become a dragon someday! o.=.o\n`;
		msg += `Feel free to give suggestions! He'll always be happy with them\n\n`;
		msg += `Discord tag: @${dragTag}\n`;
		msg += `GitHub profile: ${gitLink}`;
		message.channel.send(msg);
	}
};
