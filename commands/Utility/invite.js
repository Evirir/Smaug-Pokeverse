const Discord = require('discord.js');
const {inviteLink, inviteLinkNoAdmin} = require('../../config.json');

module.exports = {
	name: 'invite',
	description: 'Gets the link to invite me to your server!',

	async execute(message, args) {
		let embed = new Discord.RichEmbed()
		.setTitle(`Interested to have me in your server? Chant one of these blue, magical spells while worshipping the dragon god.`)
		.setDescription(
`[**Flaargle Fla Gengubble** (With admin perms)](${inviteLink} "See note for info")
[**Rarwrr Ghrrr** (No admin ver)](${inviteLinkNoAdmin})

NOTE: The Raider Lock will NOT work if you do not give Smaug the admin permission.
NOTE 2: You must use \`,,rs on\` to enable the Raider Lock and add the roles you want to lock. See \`,,help rs\` for help.`)
		.setColor('GOLD');

		message.channel.send(embed);
	}
};
