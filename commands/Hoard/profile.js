const Discord = require('discord.js');
const mongoose = require('mongoose');
const GraphUser = require('../../models/graphUser.js');
const GraphClient = require('../../models/graphClient.js');
const {getMentionUser, newGraphUser} = require('../../helper.js');

module.exports = {
	name: 'profile',
	description: `Checks your profile.`,
    aliases: ['pf'],

	async execute (message, args) {
        let target = message.author;;
        if(args.length) target = getMentionUser(message, 0) || message.author;

        let graphUser = await GraphUser.findOne({userID: target.id}).catch(err => console.log(err));
        if(!graphUser){
            graphUser = new newGraphUser(message.author);
            await graphUser.save().catch(err => console.log(err));
        }

		const kda = (deaths === 0) ? kills : kills/deaths;

        let embed = new Discord.RichEmbed()
        .setAuthor(`${target.username}'s profile`, target.displayAvatarURL)
        .setColor('GOLD')
		.addField(`Currently at node: ${target.node}`, '\u200B')
        .addField(`Coins`, `${graphUser.money}💰`)
		.addField(`Kills`, kills, true)
		.addField(`Deaths`, deaths, true)
		.addField(`KDA`, kda.toFixed(2))

        message.channel.send(embed);
    }
};
