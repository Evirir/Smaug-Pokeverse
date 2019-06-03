const Discord = require('discord.js');
const GraphServer = require('../../models/graphServer.js');

module.exports = {
	name: 'move',
	description: `Shows the graph in the server.`,
    aliases: ['mo','mov','mv'],
    wip: true,

	async execute(message, args, prefix){
		let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(!graphServer) return console.log(`move.js: No graphServer data found.`);

		const currentNode = graphServer.graphUsers.get(message.author.id);
        const targetNode = args[0];

		const neighbours = graphServer.adj.get(currentNode);

        if(!neighbours.includes(targetNode)) return message.reply(`there's no existing edge to that node.`);

        const newNeighbours = graphServer.adj.get(targetNode);

		const embed = new Discord.RichEmbed()
		.setColor(`GOLD`)
		.setAuthor(message.author.username, message.author.displayAvatarURL)
		.setTitle(`Graph of ${message.guild.name}`);

		if(!neighbours.length) embed.setDescription("You have no neighbours. Both a good thing and a bad thing.");
		else embed.addField(`Your neighbours`, `\`${neighbours.join(', ')}\``);

		message.channel.send(embed);
	}
};
