const Discord = require('discord.js');
const cytoscape = require('cytoscape');
const GraphServer = require('../../models/graphServer.js');

module.exports = {
	name: 'graph',
	description: `Shows the graph in the server.`,
    aliases: ['g','gr'],

	async execute(message, args, prefix){
		let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(!graphServer) return console.log(`graph.js: No graphServer data found.`);

		const currentNode = graphServer.graphUsers.get(message.author.id);

		graphServer.adj.get(currentNode).sort();
		const neighbours = graphServer.adj.get(currentNode);
		let list = "";
		neighbours.forEach(e => {
			list += `Node ${e[0]}: ${e[1]}\n`;
		});

		const embed = new Discord.RichEmbed()
		.setColor(`GOLD`)
		.setAuthor(message.author.username, message.author.displayAvatarURL)
		.setTitle(`Graph of ${message.guild.name}`);

		if(!neighbours.length) embed.setDescription("You have no neighbours. Both a good thing and a bad thing.");
		else embed
		.setDescription(`\`Node u: w\` = The edge to node \`u\` has weight \`w\``)
		.addField(`Your neighbours`, `\`\`\`${list}\`\`\``);

		message.channel.send(embed);
	}
};
