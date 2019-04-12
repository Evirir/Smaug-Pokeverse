module.exports = {
	name: 'server',
	description: `Shows this server's name and number of members`,
	
	execute(message, args) {
		message.channel.send(`Let me fly around a bit and see...
This server is called **${message.guild.name}** and there are **${message.guild.memberCount - 2}** hoomans and **2** dragons.`);
	}
};
