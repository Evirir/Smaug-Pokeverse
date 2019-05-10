const {consoleID} = require(`../specificData/channels.json`);

module.exports = {
	name: 'invite',
	description: 'Creates a magical telepotation link to this server',
	util: true,
	wip: true,

	async execute(message, args) {
		if(message.channel.type !== 'text')
			return message.channel.send(`Sorry, this is a DM channel so I couldn't do that.`);
		if(!message.member.hasPermission('CREATE_INSTANT_INVITE'))
			return message.reply(`you do not have the permission to create instant invites.`);

		await message.channel.send(`In most cases, there is already an existing link to this server. Are you sure that you want to create a new permanent invite link?`);
		await message.react('✅');
		await message.react('❌');

		const filter = (reaction, user) => {
			return (['✅','❌'].includes(reaction.emoji.name) && user.id === message.author.id);
		};
		const collector = message.createReactionCollector(filter, {max: 1, time: 30000});

		collector.on('collect', (reaction, reactionCollector) => {
			if(reaction.emoji.name === '❌') return message.channel.send(`Invite link creation cancelled.`);

			const invite = message.channel.createInvite({
				maxAge: 0,
			}, `Requested by ${message.author.tag}`)

			.then(() => message.channel.send(`Send them this link to teleport them here: https://discord.gg/${invite.code}`));
		});
	}
};
