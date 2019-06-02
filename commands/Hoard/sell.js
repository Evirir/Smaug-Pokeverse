const Discord = require('discord.js');
const mongoose = require('mongoose');
const {getMentionUser} = require('../../helper.js');
const GraphUser = require('../../models/graphUser.js');

module.exports = {
	name: 'sell',
	description: `Shop some goodies and make a mess in the shop`,
    usage: `[item]`,
    wip: true,

	async execute(message, args, prefix){

	}
};
