const Discord = require('discord.js');
const mongoose = require('mongoose');
const {getMentionUser} = require('../../helper.js');
const GraphUser = require('../../models/graphUser.js');

module.exports = {
	name: 'graph',
	description: `Shows the graph in the server.`,
    aliases: ['g'],
    wip: true,

	async execute(message, args, prefix){

	}
};
