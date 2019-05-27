const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
	name: `test`,
	description: `Test new features.`,
	dev: true,

	async execute(message, args){
		message.client.channels.get(44).send(`Nope`).catch(err => message.channel.send(`Nope`));
	}
}
