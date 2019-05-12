const Discord = require('discord.js');
const mongoose = require('mongoose');
const Settings = require('../models/serverSettings');

module.exports = {
	name: `test`,
	description: `Test new features. Dev only.`,
	dev: true,

	execute(message, args){
		message.channel.send(`Nothing here.`);
  	}
};
