const Discord = require('discord.js');
const mongoose = require('mongoose');
const cytoscape = require('cytoscape');
const {getMentionRole, extract} = require('../helper.js');

module.exports = {
	name: `test`,
	description: `Test new features.`,
	dev: true,

	async execute(message, args){
		message.channel.permissionOverwrites.get(args[0]).delete();
		message.channel.send(`Perm delete successful.`);
	}
}
