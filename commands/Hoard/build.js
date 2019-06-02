const Discord = require('discord.js');
const GraphServer = require('../../models/graphServer.js');
const GraphUser = require('../../models/graphUser.js');

module.exports = {
	name: 'build',
	description: `Builds a road from your current node to another node.`,
    aliases: ['bu','b'],
    args: true,
    usage: `[node]`,
    wip: true,

	async execute(message, args, prefix){
        
	}
};
