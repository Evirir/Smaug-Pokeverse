const Discord = require('discord.js');

module.exports = {
	name: 'findid',
	description: `Find the origin of some ID (only works for things I've seen).`,
    aliases: ['fi'],
    args: true,
    usage: '[ID]',

	execute(message, args){
        const client = message.client;
        const targetID = args[0];

		let type = "";
		let name = "";
        if(client.users.get(targetID)){
			type = "User";
			name = "Name: " + client.users.get(targetID).tag;
		}

		else if(client.guilds.get(targetID)){
			type = "Server";
			name = "Name: " + client.guilds.get(targetID).name;
		}

		else if(client.channels.get(targetID)){
			type = "Channel";
			name = `Name: ${client.channels.get(targetID).name}\nFrom server: ${client.channels.get(targetID).guild.name}`;
		}

		else if(message.guild.roles.get(targetID)){
			type = "Role";
			name = `Name: ${message.guild.roles.get(targetID).name}\nFrom server: ${message.guild.name}`;
		}

		else return message.channel.send(`This ID does not exist, or I have no access to it.`);

		const embed = new Discord.RichEmbed()
		.addField(`Type: ${type}`, name)
		.setColor('GREEN');

		message.channel.send(embed);
	}
};
