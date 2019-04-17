const Discord = require('discord.js');

module.exports = {
	name: 'servers',
	description: `Shows places (server) where I've gone to!`,
	aliases: [`serverlist`],

	execute(message, args){
		let reply = "Places I've been to:\n\`\`\`";
   		message.client.guilds.map((guild) => {
	   		reply += '-' + guild.name + '\n';
   		})
		reply += "\`\`\`";
		message.channel.send(reply);
 	}
};
