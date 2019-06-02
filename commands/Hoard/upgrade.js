const Discord = require('discord.js');
const GraphServer = require('../../models/graphServer.js');
const GraphUser = require('../../models/graphUser.js');

module.exports = {
	name: 'upgrade',
	description: `Builds a road from your current node to another node.`,
    aliases: ['upg'],
    args: true,
    usage: `[node]`,
    wip: true,

	async execute(message, args, prefix){

	}
};
