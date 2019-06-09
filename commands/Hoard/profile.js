const Discord = require('discord.js');
const GraphUser = require('../../models/graphUser.js');
const GraphServer = require('../../models/graphServer.js');
const {getMentionUser, newGraphUser, newGraphServerUser, ordinal} = require('../../helper.js');

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
            graphUser = await newGraphUser(target, 0);
            await graphUser.save().catch(err => console.log(err));
        }

		let graphServer = await GraphServer.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!graphServer) return console.log(`profile.js: No graphServer data found.`);

		const currentNode = graphServer.userLocations.find({id: message.author.id}).node;
		const kda = (graphUser.deaths === 0) ? graphUser.kills : graphUser.kills/graphUser.deaths;

        let embed = new Discord.RichEmbed()
        .setAuthor(`${target.username}'s profile`, target.displayAvatarURL)
        .setColor('GOLD')
	    .addField(`Coins`, `${graphUser.money}💰`)
		.addField(`Kills`, graphUser.kills, true)
		.addField(`Deaths`, graphUser.deaths, true)
		.addField(`KDA`, kda.toFixed(2), true);

		if(currentNode === undefined) embed.setDescription(`This user is not in this server's graph.`);
		else embed.setDescription(`**Current node:** \`${currentNode}\``);


        message.channel.send(embed);
    }
};
