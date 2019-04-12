module.exports = {
	name: 'invite',
	description: 'Creates a magical telepotation link to this server',
	aliases: [`inv`],

	execute(message, args) {
		channel.createInvite()
  		.then(invite => console.log(`Created an invite with a code of ${invite.code}`))
  		.catch(console.error);
	}
};
