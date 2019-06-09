const Discord = require('discord.js');
const GraphServer = require('../../models/graphServer.js');
const GraphUser = require('../../models/graphUser.js');
const {getEdge} = require('../../helper.js');

const buildCost = 450;
const buildWeight = 4;

function cmpPair(a, b){
	return a.v - b.v;
}

module.exports = {
	name: 'build',
	description: `Builds an edge of weight ${buildWeight} from your current node to another node. Costs ${buildCost} money.`,
    aliases: ['bu'],
    usage: `[node]`,

	async execute(message, args, prefix){
        let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!graphServer) return console.log(`build.js: No graphServer data found.`);
        let graphUser = await GraphUser.findOne({userID: message.author.id}).catch(err => console.log(err));
        if(!graphUser) return console.log(`build.js: No graphUser data found.`);

		if(!args.length) return message.channel.send(`Missing node! Please input a node number within \`[0, ${graphServer.nodeCount - 1}]\``);

        let currentNode = graphServer.userLocations.find(u => u.id === message.author.id).node;
        let targetNode = parseInt(args[0]);

        if(isNaN(args[0]) || targetNode >= graphServer.nodeCount || targetNode < 0)
			return message.channel.send(`Invalid node number. Please input a node within \`[0, ${graphServer.nodeCount - 1}]\`.`);
        if(targetNode === currentNode)
			return message.channel.send(`A self-loop is useless in this game, please don't do it and keep the graph *simple*.`);

		const testEdge = await getEdge(currentNode, targetNode, graphServer);
    	if(testEdge)
            return message.channel.send(`Edge \`${currentNode}-${targetNode}\` already exists.`);
        if(graphUser.money < buildCost)
			return message.reply(`you do not have enough money.`);

		graphServer.adj[currentNode].push({v: targetNode, w: buildWeight});
		graphServer.adj[currentNode].sort(cmpPair);

		graphServer.adj[targetNode].push({v: currentNode, w: buildWeight});
		graphServer.adj[targetNode].sort(cmpPair);

		graphUser.money -= buildCost;

        await graphUser.save().catch(err => console.log(err));
        await graphServer.save().catch(err => console.log(err));

        const embed = new Discord.RichEmbed()
        .setColor(`GREEN`)
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .setTitle(`Edge successfully built!`)
        .setDescription(`An undirected edge **${currentNode}-${targetNode}** of weight ${buildWeight} has been built.`)
        .setFooter(`Use ${prefix}graph to see the new graph.`);

		const test = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        return message.channel.send(embed);
	}
};
