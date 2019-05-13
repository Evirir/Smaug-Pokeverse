const Discord = require('discord.js');

module.exports = {
	name: 'invite',
	description: 'Gets the link to invite me to your server!',
	util: true,

	async execute(message, args) {
		let embed = new Discord.RichEmbed()
		.setTitle(`Interested to have me in your server? Chant this long, blue, magical spell while worshipping the god of the dragons!`)
		.setDescription(`<https://discordapp.com/oauth2/authorize?&client_id=557528854147629056&scope=bot&permissions=67434561>`)
		.setColor('BLUE')
		.setFooter(`Regards,\nSmaug the dragon\nCarefully made by Evirir the Blue\nP.S. Nah jk, just click on the link`);

		message.channel.send(embed);
	}
};
