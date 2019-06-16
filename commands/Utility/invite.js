const Discord = require('discord.js');
const {inviteLink, inviteLinkNoAdmin} = require('../../config.json');

module.exports = {
	name: 'invite',
	description: 'Gets the link to invite me to your server!',

	async execute(message, args) {
		let embed = new Discord.RichEmbed()
		.setTitle(`Interested to have me in your server? Chant this blue, magical spell while worshipping the dragon god.`)
		.setDescription(
`[Flaargle Fla Gengubble (With admin perms)](${inviteLink} "See note for info")
[Rarwrr Ghrrr (No admin ver)](${inviteLinkNoAdmin})

NOTE: The Raider Lock will NOT work if you do not give Smaug admin permmissions.
If you can't give Smaug the admin permission, you can give Smaug the 'Manage Channel Permissions' permission in **every** channel where Raiders may spawn (Right-click channel -> Edit Channel -> Permissions).
NOTE 2: You must use \`,,rs on\` to enable the Raider Lock and add the roles you want to lock with \`,,rs role add [role]\`. See \`,,help rs\` for usage.`)
		.setColor('GOLD');

		message.channel.send(embed);
	}
};
