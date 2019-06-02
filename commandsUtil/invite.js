const Discord = require('discord.js');
const {inviteLink} = require('../config.json');

module.exports = {
	name: 'invite',
	description: 'Gets the link to invite me to your server!',
	util: true,

	async execute(message, args) {
		let embed = new Discord.RichEmbed()
		.setTitle(`Interested to have me in your server? Chant this blue, magical spell while worshipping the dragon god.`)
		.setDescription(`[Flaargle Fla Gengubble](${inviteLink} "Nah just click on it")`)
		.setColor('GOLD');

		message.channel.send(embed);
	}
};
