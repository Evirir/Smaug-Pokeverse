const Discord = require('discord.js');
const GraphServer = require('../../models/graphServer.js');
const GraphUser = require('../../models/graphUser.js');
const buildCost = 450;
const buildWeight = 4;

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
        let targetNode = args[0];
        if(isNaN(targetNode) || parseInt(targetNode) >= graphServer.nodeCount || parseInt(targetNode) < 0) return message.channel.send(`Invalid node number. Please input a node within \`[0, \`${graphServer.nodeCount - 1}]\`.`);

        if(parseInt(targetNode) === parseInt(currentNode)) return message.channel.send(`A self-loop is useless in this game, please don't do it and keep the graph *simple*.`);

    	if(graphServer.adj.get(currentNode).includes(targetNode) || graphServer.adj.get(targetNode).includes(currentNode))
            return message.channel.send(`Edge **${currentNode}-${targetNode}** already exists.`);

        if(graphUser.money < buildCost) return message.reply(`you do not have enough money.`);

		let currentAdj = graphServer.adj.get(currentNode);
		currentAdj.push([targetNode, buildWeight]);
		let targetAdj = graphServer.adj.get(targetNode);
		targetAdj.push([currentNode, buildWeight]);

        await graphServer.adj.set(currentNode, currentAdj);
        await graphServer.adj.set(targetNode, targetAdj);

        graphUser.money -= buildCost;

        await graphUser.save().catch(err => console.log(err));
        await graphServer.save().catch(err => console.log(err));

        const embed = new Discord.RichEmbed()
        .setColor(`GREEN`)
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .setTitle(`Edge successfully built!`)
        .setDescription(`An undirected edge **${currentNode}-${targetNode}** of weight ${buildWeight} has been built.`)
        .setFooter(`Use ${prefix}graph to see the new graph.`);

        return message.channel.send(embed);
	}
};
