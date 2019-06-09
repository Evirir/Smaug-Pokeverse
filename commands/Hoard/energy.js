const Discord = require('discord.js');
const GraphUser = require('../../models/graphUser.js');
const {msToTime, DayinMS} = require('../../helper.js');

const maxEnergy = 6;

module.exports = {
	name: 'energy',
	description: `Checks your energy.`,
    aliases: ['e'],

	async execute (message, args) {
        let graphUser = await GraphUser.findOne({userID: message.author.id}).catch(err => console.log(err));
        if(!graphUser) return console.log(`No graphUser data found: energy.js; userID: ${message.author.id}`);

        message.channel.send(`You have ${graphUser.energy}/${maxEnergy}.`);
	}
};
