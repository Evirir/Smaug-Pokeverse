const Discord = require('discord.js');
const GraphUser = require('../../models/graphUser.js');
const GraphServer = require('../../models/graphServer.js');

module.exports = {
	name: 'move',
	description: `Shows the graph in the server.`,
    aliases: ['mo','mov','mv'],

	async execute(message, args, prefix){
		let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(!graphServer) return console.log(`move.js: No graphServer data found.`);
		let graphUser = await GraphUser.findOne({userID: message.author.id}).catch(err => console.log(err));
		if(!graphUser) return console.log(`move.js: No graphUser data found.`);

		let currentNode = graphServer.userLocations.find(u => u.id === message.author.id).node;
        const targetNode = parseInt(args[0]);
		if(currentNode === targetNode) return message.reply(`you have moved to where you are. Congrats I guess.`);

		const targetEdge = graphServer.adj[currentNode].find(e => e.v === targetNode);
        if(!targetEdge) return message.reply(`there's no existing edge that is directed to that node.`);
		//if(graphUser.energy < targetEdge.w) return message.reply(`you do not have enough energy!`);

		//graphUser.energy -= targetEdge.w;
		graphServer.userLocations.find(u => u.id === message.author.id).node = targetNode;
		graphServer.nodeUsers[currentNode].pull(message.author.id);
		graphServer.nodeUsers[targetNode].push(message.author.id);

        await graphServer.save().catch(err => console.log(err));
		await graphUser.save().catch(err => console.log(err));

		const embed = new Discord.RichEmbed()
		.setColor(`GOLD`)
		.setAuthor(message.author.username, message.author.displayAvatarURL)
		.setDescription(`Moved from node ${currentNode} to node **${targetNode}**!\nEnergy left: ${graphUser.energy}`);

		message.channel.send(embed);
	}
};
