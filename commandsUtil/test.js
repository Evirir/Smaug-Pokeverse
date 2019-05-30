const Discord = require('discord.js');
const mongoose = require('mongoose');
const cytoscape = require('cytoscape');
const {getMentionRole, extract} = require('../helper.js');

module.exports = {
	name: `test`,
	description: `Test new features.`,
	dev: true,

	async execute(message, args){
		const arg1 = getMentionRole(message, 1, 1);
		message.channel.send(arg1.id);
	}
}
