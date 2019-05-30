const Discord = require('discord.js');
const mongoose = require('mongoose');
const cytoscape = require('cytoscape');
const {extract} = require('../helper.js');

module.exports = {
	name: `test`,
	description: `Test new features.`,
	dev: true,

	async execute(message, args){
		message.channel.send(getMentionRole(message, 0).name);
	}
}
