module.exports = {
	name: 'invite',
	description: 'Creates a magical telepotation link to this server',
	
	execute(message, args) {
		message.channel.send(`Inviting people here? Give them this magical link: https://discord.gg/pZQmFkd`);
	}
};
