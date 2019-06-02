const Discord = require('discord.js');
const {getMentionUser} = require('../../helper.js');
const GraphUser = require('../../models/graphUser.js');

module.exports = {
	name: 'change',
	description: `Changes your type`,
    aliases: ['chg'],
    usage: `[type]`,
    wip: true,

	async execute(message, args, prefix){

	}
};
