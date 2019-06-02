const Discord = require('discord.js');
const GraphServer = require('../../models/graphServer.js');
const GraphUser = require('../../models/graphUser.js');

module.exports = {
	name: 'destroy',
	description: `Builds a road from your current node to another node.`,
    aliases: ['de'],
    args: true,
    usage: `[node]`,
    wip: true,

	async execute(message, args, prefix){

	}
};
