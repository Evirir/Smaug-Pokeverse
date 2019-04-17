const Discord = require('discord.js');

module.exports = {
	name: 'servers',
	description: `Shows places (server) where I've gone to!`,
	aliases: [`serverlist`],

	execute(message, args){
		let servers = "";
   		message.client.guilds.map((guild) => {
	   		servers += '- ' + guild.name + '\n';
   		})

		const embed = new Discord.RichEmbed()
			.setTitle("Places I've flew to:")
			.setDescription(servers)
			.setColor('ORANGE');

		message.channel.send(embed);
 	}
};
