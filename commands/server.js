const {dragID,drag2ID} = require(`../config.json`);

module.exports = {
	name: 'server',
	description: `Shows this server's name and number of members`,
	aliases: [`serverinfo`],

	execute(message, args) {
		var dragoncnt = 0;
		if(guild.member(dragID)) dragoncnt++;
		if(guild.member(drag2ID)) dragoncnt++;

		message.channel.send(`Let me fly around a bit and see...
This server is called **${message.guild.name}** and there are **${message.guild.memberCount - dragoncnt - 1}** hoomans and **${dragoncnt + 1}** dragons.`);
	}
};
