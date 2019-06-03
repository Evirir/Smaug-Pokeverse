const Discord = require('discord.js');
const GraphServer = require('../../models/graphServer.js');
const GraphUser = require('../../models/graphUser.js');
const {getEdge} = require('../../helper.js');

const buildCost = 450;
const buildWeight = 4;

function cmpPair(a, b){
	return a[0] - b[0];
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

		if(!args.length) return message.channel.send(`Please specify a node number within \`[0, ${graphServer.nodeCount - 1}]\``);

        let currentNode = graphServer.graphUsers.get(message.author.id);
        let targetNode = parseInt(args[0]);

        if(isNaN(args[0]) || targetNode >= graphServer.nodeCount || targetNode < 0)
			return message.channel.send(`Invalid node number. Please input a node within \`[0, ${graphServer.nodeCount - 1}]\`.`);
        if(targetNode === currentNode)
			return message.channel.send(`A self-loop is useless in this game, please don't do it and keep the graph *simple*.`);
    	if(getEdge(currentNode, targetNode, graphServer))
            return message.channel.send(`Edge \`${currentNode}-${targetNode}\` already exists.`);
        if(graphUser.money < buildCost) return message.reply(`you do not have enough money.`);

		let curAdj = graphServer.adj[currentNode]; console.log(curAdj);
		curAdj.push([targetNode, buildWeight]);
		curAdj.sort(cmpPair);
		graphServer.adj[currentNode] = curAdj;

		let tarAdj = graphServer.adj[targetNode];
		tarAdj.push([currentNode, buildWeight]);
		curAdj.sort(cmpPair);
		graphServer.adj[targetNode] = tarAdj;

		graphUser.money -= buildCost;

        await graphUser.save().catch(err => console.log(err));
        await graphServer.save().catch(err => console.log(err));

        const embed = new Discord.RichEmbed()
        .setColor(`GREEN`)
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .setTitle(`Edge successfully built!`)
        .setDescription(`An undirected edge **${currentNode}-${targetNode}** of weight ${buildWeight} has been built.`)
        .setFooter(`Use ${prefix}graph to see the new graph.`);
		console.log(graphServer.adj[currentNode]);
		console.log(GraphServer.findOne({serverID: message.guild.id}).adj[currentNode]);
        return message.channel.send(embed);
	}
};
