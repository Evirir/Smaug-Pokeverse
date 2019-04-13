const {consoleID} = require(`../channels.json`);

module.exports = {
	name: 'invite',
	description: 'Creates a magical telepotation link to this server',
	aliases: [`inv`],

	execute(message, args) {
		message.reply(`this feature is not available yet!`);
		//var invite = message.channel.createInvite();
  		//console.log(`Created an invite with a code of ${invite.code}`);
		//message.channel.send(`Created an invite with a code of ${invite.code}`);
	}
};
