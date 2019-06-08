const Discord = require('discord.js');
const GraphUser = require('../../models/graphUser.js');
const GraphServer = require('../../models/graphServer.js');

module.exports = {
	name: 'move',
	description: `Shows the graph in the server.`,
    aliases: ['mo','mov','mv'],
    wip: true,

	async execute(message, args, prefix){
		let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(!graphServer) return console.log(`move.js: No graphServer data found.`);
		let graphUser = await GraphUser.findOne({userID: message.author.id}).catch(err => console.log(err));
		if(!graphUser) return console.log(`move.js: No graphUser data found.`);

		const currentNode = graphServer.graphUsers.get(message.author.id);
        const targetNode = parseInt(args[0]);

		const targetEdge = graphServer.adj.get(currentNode).find(e => e.v === targetNode);

        if(!targetEdge) return message.reply(`there's no existing edge to that node.`);

		graphUser.energy -= targetEdge.w;
		graphServer.graphUsers.set(message.author.id, targetNode);
		//graphServer.nodeUsers[

        await graphServer.save().catch(err => console.log(err));
		await graphUser.save().catch(err => console.log(err));

		const embed = new Discord.RichEmbed()
		.setColor(`GOLD`)
		.setAuthor(message.author.username, message.author.displayAvatarURL)
		.setTitle(`Graph of ${message.guild.name}`);

		if(!neighbours.length) embed.setDescription("You have no neighbours. Both a good thing and a bad thing.");
		else embed.addField(`Your neighbours`, `\`${neighbours.join(', ')}\``);

		message.channel.send(embed);
	}
};
