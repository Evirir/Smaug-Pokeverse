module.exports = {
	name: 'avatar',
	description: `Shows your/mentions' avatar(s)`,
	aliases: [`icon`,`image`,`img`],
	usage: '[user1] [user2]...',

	execute(message,args){
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
		}

		const avatarList = message.mentions.users.map( user => {
			return `${user.username}'s avatar: ${user.displayAvatarURL}`;
		})
		message.channel.send(avatarList);
	}
}
