const Discord = require('discord.js');

module.exports = {
	name: 'invite',
	description: 'Gets the link to invite me to your server!',
	util: true,

	async execute(message, args) {
		let embed = new Discord.RichEmbed()
		.setTitle(`Interested to have me in your server? Chant this blue, magical spell while worshipping the dragon god.`)
		.setDescription(`[Flaargle Fla Gengubble](https://discordapp.com/oauth2/authorize?&client_id=557528854147629056&scope=bot&permissions=325712 "Nah just click on it")`)
		.setColor('GOLD');

		message.channel.send(embed);
	}
};
