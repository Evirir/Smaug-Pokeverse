const Discord = require('discord.js');
const mongoose = require('mongoose');
const {getMentionUser} = require('../../helper.js');
const GraphUser = require('../../models/graphUser.js');
const Item = require('../../models/graphItem.js');

module.exports = {
	name: 'use',
	description: `owo what's this? *uses something*  *triggers volcano eruption*`,
    usage: `[item]`,
    wip: true,

	async execute(message, args, prefix){

	}
};
