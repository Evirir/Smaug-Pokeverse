const Discord = require('discord.js');

module.exports = {
	name: 'avatar',
	description: `Shows your/mentions' avatar(s)`,
	aliases: [`icon`,`image`,`img`],
	usage: '[user1] [user2]...',

	execute(message,args){
		if (!message.mentions.users.size) {
			const embed = new Discord.RichEmbed()
				.setTitle('Your avatar:')
				.setImage(message.author.displayAvatarURL)
			return message.channel.send(embed);
		}

		const avatarList = message.mentions.users.map( user => {
			const embed = new Discord.RichEmbed()
				.setTitle(`${user.tag}'s avatar:`)
				.setImage(user.displayAvatarURL);

			message.channel.send(embed);
		});
	}
}
