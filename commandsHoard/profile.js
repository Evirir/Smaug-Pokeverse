const Discord = require('discord.js');
const mongoose = require('mongoose');
const Money = require('../models/money.js');
const GraphUser = require('../models/graphUser.js');
const GraphClient = require('../models/graphClient.js');
const {getMentionUser} = require('../helper.js');

module.exports = {
	name: 'profile',
	description: `Checks your profile.`,
    aliases: ['pf'],
    hoard: true,
    wip: true,

	async execute (message, args) {
        let target = message.author;;
        if(args.length) target = getMentionUser(message, args[0]) || message.author;

        let graphClient = await GraphClient.findOne({}).catch(err => console.log(err));
        if(!graphClient) return console.log(`profile.js: No graph client found`);

        let money = await Money.findOne({userID: target.id}).catch(err => console.log(err));
        if(!money){
        	money = new Money({
        		userID: target.id,
        		money: 1000,
        		nextDaily: new Date(),
        		inventory: []
        	});
        	await money.save().catch(err => console.log(err));
        }

        let graphUser = await GraphUser.findOne({userID: target.id}).catch(err => console.log(err));
        if(!graphUser){
            graphUser = new GraphUser({
                userID: message.author.id,
                graphID: graphClient.totalGraphers,
                node: graphClient.totalGraphers,
                energy: 6
            });
            await graphUser.save().catch(err => console.log(err));
        }

        let embed = new Discord.RichEmbed()
        .setAuthor(`${target.username}'s hoard`, target.displayAvatarURL)
        .setColor('GOLD')
        .addField(`Coins`, `${money.money}💰`);

        money.inventory.forEach(item => {
            embed.addField(`${item.name} x${item.amount}`,`\u200b`);
        });

        message.channel.send(embed);
    }
};
