const Discord = require('discord.js');
const cytoscape = require('cytoscape');
const GraphServer = require('../../models/graphServer.js');
const {getMentionUser} = require('../../helper.js');

module.exports = {
	name: 'graph',
	description: `Shows the graph in the server.`,
    aliases: ['g','gr'],

	async execute(message, args, prefix){
		let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(!graphServer) return console.log(`graph.js: No graphServer data found.`);

		const targetUser = getMentionUser(message, 0) || message.author;
		const currentNode = graphServer.userLocations.find({id: targetUser.id}).node;

		let list = [];
		graphServer.adj[currentNode].forEach(e => {
			list.push( `${e.v}(${e.w})`);
		});

		const embed = new Discord.RichEmbed()
		.setColor(`GOLD`)
		.setAuthor(`${targetUser.username}'s Adjacency List`, targetUser.displayAvatarURL)
		.setDescription(`Node: \`${currentNode}\``);

		if(!graphServer.adj[currentNode].length) embed.setDescription("No neighbours found. Both a good thing and a bad thing.");
		else embed
		.addField(`Neighbours`, `\`[${list.join(', ')}]\``)
		.setFooter(`u(w) = The edge to node u has weight w`)

		message.channel.send(embed);
	}
};
