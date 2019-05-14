const Discord = require('discord.js');
const mongoose = require('mongoose');
const Settings = require('../models/serverSettings');
const cytoscape = require('cytoscape');

let graph = cytoscape({
	elements: [
		{data: {id: '1'}},
		{data: {id: '2'}},
		{data: {id: '3'}},
		{data: {id: 'e1', source: '1', target: '2'}},
		{data: {id: 'e2', source: '3', target: '2'}}
	],

	layout: {
		name: 'circle',
	}
});

module.exports = {
	name: `test`,
	description: `Test new features.`,
	dev: true,

	async execute(message, args){
		let image = graph.png();
		message.channel.send(image);
	}
}
