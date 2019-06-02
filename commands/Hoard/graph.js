const Discord = require('discord.js');
const GraphServer = require('../../models/graphServer.js');

module.exports = {
	name: 'graph',
	description: `Shows the graph in the server.`,
    aliases: ['gr'],

	async execute(message, args, prefix){
		let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(!graphServer) return console.log(`graph.js: No graphServer data found.`);

		const currentNode = graphServer.graphUsers.get(message.author.id)

		graphServer.adj.get(currentNode).sort();
		const neighbours = graphServer.adj.get(currentNode);

		const embed = new Discord.RichEmbed()
		.setColor(`GOLD`)
		.setAuthor(message.author.username, message.author.displayAvatarURL)
		.setTitle(`${message.guild.name}'s graph`)
		.setDescription(neighbours.length ? "You have no neighbours. Both a good thing and a bad thing." : `Your neighbours are: \`${neighbours.join(', ')}\``)

		message.channel.send(embed);
	}
};
