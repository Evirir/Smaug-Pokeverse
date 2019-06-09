const Discord = require('discord.js');
const GraphServer = require('../../models/graphServer.js');
const GraphUser = require('../../models/graphUser.js');
const {getEdge} = require('../../helper.js');

const destroyCost = 1200;

module.exports = {
	name: 'destroy',
	description: `Destroys the edge from your current node to the target node. Costs ${destroyCost} money.`,
    usage: `[node]`,

	async execute(message, args, prefix){
        let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!graphServer) return console.log(`destroy.js: No graphServer data found.`);
        let graphUser = await GraphUser.findOne({userID: message.author.id}).catch(err => console.log(err));
        if(!graphUser) return console.log(`destroy.js: No graphUser data found.`);

		if(!args.length) return message.channel.send(`Missing node! Please input a node number within \`[0, ${graphServer.nodeCount - 1}]\``);

        let currentNode = graphServer.userLocations.find(u => u.id === message.author.id).node;
        let targetNode = parseInt(args[0]);

        if(isNaN(args[0]) || targetNode >= graphServer.nodeCount || targetNode < 0)
			return message.channel.send(`Invalid node number. Please input a node within \`[0, ${graphServer.nodeCount - 1}]\`.`);
        if(targetNode === currentNode)
			return message.channel.send(`But I never allowed you to build self-loops!`);

		const testEdge = await getEdge(currentNode, targetNode, graphServer);
		const testEdge2 = await getEdge(targetNode, currentNode, graphServer);
    	if(!testEdge && !testEdge2)
            return message.channel.send(`Edge \`${currentNode}-${targetNode}\` does not exist.`);
        if(graphUser.money < destroyCost)
			return message.reply(`you do not have enough money.`);

		graphServer.adj[currentNode].pull(testEdge._id);
		graphServer.adj[targetNode].pull(testEdge2._id);

		graphUser.money -= destroyCost;

        await graphUser.save().catch(err => console.log(err));
        await graphServer.save().catch(err => console.log(err));

        const embed = new Discord.RichEmbed()
        .setColor(`RED`)
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .setTitle(`Boom. Edge successfully destroyed!`)
        .setDescription(`Edge **${currentNode}-${targetNode}** has been destroyed.`)
        .setFooter(`Use ${prefix}graph to see the new graph.`);

		const test = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        return message.channel.send(embed);
	}
};
