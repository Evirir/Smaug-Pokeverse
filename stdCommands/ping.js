const {consoleID} = require(`../channels.json`);
const Discord = require('discord.js');

module.exports = {
	name: 'ping',
	description: `"Reports the latency and API latency"...that's what the magic book says, whatever that means`,

	execute(message, args){
		const embed = new Discord.RichEmbed()
		.setTitle(`Pong!`)
		.setDescription(`API Latency is ${Math.round(message.client.ping)}ms.`)
		.setTimestamp()
		.setColor('RED');

	    message.channel.send(embed);
	}
};
