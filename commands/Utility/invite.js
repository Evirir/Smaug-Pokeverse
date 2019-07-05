const Discord = require('discord.js');
const {inviteLink, inviteLinkNoAdmin} = require('../../config.json');

module.exports = {
	name: 'invite',
	description: 'Gets the link to invite me to your server!',

	async execute(message, args) {
		let embed = new Discord.RichEmbed()
		.setTitle(`You wanna...invite me to your server?`)
		.setDescription(
`Sure! Just chant one of these magical links perfectly in dragontongue, and I'll be going to your party! >.=.<

With admin perms: [**Flaargle Fla Gengubble**](${inviteLink} "i.e. I WANT SMAUG TO LOCK RAIDERS FOR ME")
No admin perms: [**Zakorrif Fraguarlue**](${inviteLinkNoAdmin} "${inviteLinkNoAdmin}")

Smaug's Support Server: https://discord.gg/qttxbKe

P.S. The Raider Lock will NOT work if you do not give Smaug the admin permission.
P.S.S: You must use \`,,rs on\` to enable the Raider Lock and add the roles you want to lock. See \`,,help rs\` for help.`)
		.setColor('GOLD')
		.setThumbnail(message.client.user.displayAvatarURL);

		message.channel.send(embed);
	}
};
