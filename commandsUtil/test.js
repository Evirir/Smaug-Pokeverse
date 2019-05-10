const Discord = require('discord.js');

module.exports = {
	name: `test`,
	description: `Test new features. Dev only.`,
	dev: true,

	execute(message, args){
		let embed = new Discord.RichEmbed()
		.setAuthor(`Here's a reaction test`, message.author.displayAvatarURL)
		.addField(`Field 1`, `content1`)
		.addField(`Field 2`, `content2`)
		.addField(`Inline field 1`, `icontent1`, true)
		.addField(`Inline field 2`, `icontent2`, true);

		message.channel.send(embed).then(async m => {
			await m.react('⬅')
			await m.react('➡')
			await m.react('🐉')
		});
  	}
};
