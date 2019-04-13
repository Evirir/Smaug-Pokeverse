const {consoleID} = require(`../channels.json`);

module.exports = {
	name: 'invite',
	description: 'Creates a magical telepotation link to this server',
	aliases: [`inv`,`link`],
	wip: true,

	execute(message, args) {
		var invite = message.channel.createInvite();
  		console.log(`Created an invite with a code of ${invite.code}`);
		message.channel.send(`Created an invite with a code of ${invite.code}`);
	}
};
