const Discord = require('discord.js');
const cytoscape = require('cytoscape');
const {getMentionUser, extract} = require('../../helper.js');

module.exports = {
	name: `test`,
	description: `Test new features.`,
	dev: true,

	async execute(message, args){
		message.channel.send(getMentionUser(message, 0).username);
	}
}
