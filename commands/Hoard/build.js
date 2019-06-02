const Discord = require('discord.js');
const GraphServer = require('../../models/graphServer.js');
const GraphUser = require('../../models/graphUser.js');
const buildCost = 450;
const buildWeight = 4;

module.exports = {
	name: 'build',
	description: `Builds an edge of weight ${buildWeight} from your current node to another node. Costs ${buildCost} money.`,
    aliases: ['bu'],
    args: true,
    usage: `[node]`,

	async execute(message, args, prefix){
        let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!graphServer) return console.log(`build.js: No graphServer data found.`);
        let graphUser = await GraphUser.findOne({userID: message.author.id}).catch(err => console.log(err));
        if(!graphUser) return console.log(`build.js: No graphUser data found.`);

        let adj = graphServer.adj;
        let currentNode = parseInt(graphServer.graphUsers.get(message.author.id));
        let targetNode = parseInt(args[0]);
        if(isNaN(targetNode) || targetNode >= graphServer.nodeCount || targetNode < 0) return message.channel.send(`Invalid node number. Node range: \`[0, ${graphServer.nodeCount - 1}]\``);

        if(targetNode === currentNode) return message.channel.send(`A self-loop is useless in this game, please don't do it and keep the graph *simple*.`);

        currentNode = currentNode.toString();
        targetNode = targetNode.toString();
        if(!adj.get(currentNode)) adj.set(currentNode, []);
        if(!adj.get(targetNode)) adj.set(targetNode, []);

        if(adj.get(currentNode).includes(targetNode) || adj.get(targetNode).includes(currentNode))
            return message.channel.send(`Edge **${currentNode}-${targetNode}** already exists.`);

        if(graphUser.money < buildCost) return message.channel.reply(`you do not have enough money.`);

        adj.get(currentNode).push(targetNode);
        adj.get(targetNode).push(currentNode);

        graphUser.money -= buildCost;

        await graphUser.save().catch(err => console.log(err));
        await graphServer.save().catch(err => console.log(err));

        const embed = new Discord.RichEmbed()
        .setColor(`GREEN`)
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .setTitle(`Edge successfully built!`)
        .setDescription(`An undirected edge **${currentNode}-${targetNode}** of weight ${buildWeight} has been built.`)
        .addField(`Your new neighbours:`, `\`${adj.get(currentNode).join(', ')}\``);

        return message.channel.send(embed);
	}
};
