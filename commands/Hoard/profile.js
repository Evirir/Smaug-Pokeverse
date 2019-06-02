const Discord = require('discord.js');
const mongoose = require('mongoose');
const GraphUser = require('../../models/graphUser.js');
const GraphServer = require('../../models/graphServer.js');
const {getMentionUser, newGraphUser} = require('../../helper.js');

module.exports = {
	name: 'profile',
	description: `Checks someone's profile.`,
    aliases: ['pf'],
	usage: `[target]`,

	async execute (message, args) {
        let target = message.author;
        if(args.length) target = getMentionUser(message, 0) || message.author;

        let graphUser = await GraphUser.findOne({userID: target.id}).catch(err => console.log(err));
        if(!graphUser){
            graphUser = newGraphUser(target);
            await graphUser.save().catch(err => console.log(err));
        }

		let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!graphServer) return console.log(`profile.js: No graphServer data found.`);

		let currentNode = graphServer.graphUsers.get(target.id);
		if(currentNode === undefined){
			graphServer.graphUsers.set(target.id, graphServer.nodeCount);
			currentNode = graphServer.nodeCount++;
			await graphServer.save().catch(err => console.log(err));
		}

		const kda = (graphUser.deaths === 0) ? graphUser.kills : graphUser.kills/graphUser.deaths;

        let embed = new Discord.RichEmbed()
        .setAuthor(`${target.username}'s profile`, target.displayAvatarURL)
        .setColor('GOLD')
		.setDescription(`In this server, you're currently at node: \`${currentNode}\``)
        .addField(`Coins`, `${graphUser.money}💰`)
		.addField(`Kills`, graphUser.kills, true)
		.addField(`Deaths`, graphUser.deaths, true)
		.addField(`KDA`, kda.toFixed(2), true)

        message.channel.send(embed);
    }
};
