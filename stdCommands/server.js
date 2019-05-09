const {dragID,drag2ID,godID,zsID} = require(`../specificData/users.json`);
const Discord = require('discord.js');

module.exports = {
	name: 'server',
	description: `Shows this server's name and number of members`,
	aliases: [`serverinfo`],

	execute(message, args) {
		var dragoncnt = 0, hasDrag = false, hasDrag2 = false;
		var msg = "";
		if(message.guild.member(dragID)) {dragoncnt++; hasDrag = true;}
		if(message.guild.member(drag2ID)) {dragoncnt++; hasDrag2 = true;}

		msg += (`Let me fly around a bit and see...`);
		msg += (`\nThis server is called **${message.guild.name}** and there are **${message.guild.memberCount - dragoncnt - 1}** hoomans and **${dragoncnt + 1}** dragons.`);


		if(dragoncnt==0) msg += (`\n\nWho is the dragon? `);
		else msg += (`\n\nWho are the ${dragoncnt+1} dragons? `);
		if(hasDrag) msg += (`Evirir, `);
		if(hasDrag2) msg += (`Gariffred, `);
		if(hasDrag || hasDrag2) msg += (`and me! **rawrs**`);
		else msg += (`Me! **rawrs**`);

		if(message.guild.member(godID)) msg += (`\nThe ultimate MGod is here watching us too!`);
		if(message.guild.member(zsID)) msg += (`\nOh, zscoder the God of Everything ~~except geometry~~ is here too.`);

		const embed = new Discord.RichEmbed()
		.setTitle('Server Info')
		.setDescription(msg)
		.setColor('BLUE');

		message.channel.send(embed);
	}
};
