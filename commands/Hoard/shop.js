const Discord = require('discord.js');
const mongoose = require('mongoose');
const {getMentionUser} = require('../../helper.js');
const GraphUser = require('../../models/graphUser.js');

module.exports = {
	name: 'shop',
	description: `Shop some goodies and make a mess in the shop`,
    aliases: ['s','buy'],
    usage: `[item]`,
    wip: true,

	async execute(message, args, prefix){

	}
};
