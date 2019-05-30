const Discord = require('discord.js');
const mongoose = require('mongoose');
const cytoscape = require('cytoscape');
const {getMentionRole, extract} = require('../helper.js');

module.exports = {
	name: `test`,
	description: `Test new features.`,
	dev: true,

	async execute(message, args){
		const arg1 = extract(message.content, 0);
		message.channel.send(arg1);
	}
}
