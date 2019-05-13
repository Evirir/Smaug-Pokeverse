const Discord = require('discord.js');
const mongoose = require('mongoose');
const Settings = require('../models/serverSettings');
const {cute} = require('../imageLinks.json');

module.exports = {
	name: `test`,
	description: `Test new features.`,
	dev: true,

	async execute(message, args){
		const eevee = message.client.emojis.find(e => e.name === 'eeveelution');
		if(!eevee) return message.channel.send(`Eevee emoji not found.`);
		const filter = response => {
			return response.author.id === message.author.id;
		};

		await message.channel.send(`Please specify your message.`);
		let collected = await message.channel.awaitMessages(filter, {maxMatches: 1, time: 20000, errors: ['time']}).catch(collected => message.channel.send(`20 seconds is up. No sentence is received.`));

		let str = collected.first().content;
		let regex = /:eevee:/gi;
		str.replace(regex, `${eevee}`);
		message.channel.send(str);
	}
}
