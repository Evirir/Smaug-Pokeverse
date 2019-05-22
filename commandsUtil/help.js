const Discord = require('discord.js');
const {defaultPrefix} = require('../config.json');
const {dragTag, botID} = require(`../specificData/users.json`);

//const mongoose = require('mongoose');
const Settings = require('../models/serverSettings.js');

module.exports = {
	name: 'help',
	description: `Shows list of spells that I know. Use \`${defaultPrefix}help [spell]\` to view details of the spell.`,
	aliases: ['commands','command','cmd'],
	usage: '[spell-name]',
	util: true,
	notes: `(Also, nice job on getting help on a help command)`,

	async execute(message, args){
		let prefix = ",,";
		const p = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(p) prefix = p.prefix;

		const data = [];
		const {commands} = message.client;

		let stdcmd = [], devcmd = [], utilcmd = [], hoardcmd = [], pokecmd = [];

		commands.forEach(c => {
			if(!c.hidden){
				if(c.dev) devcmd.push(c.name);
				else if(c.hoard) hoardcmd.push(c.name);
				else if(c.util) utilcmd.push(c.name);
				else if(c.poke) pokecmd.push(c.name);
				else stdcmd.push(c.name);
			}
		});

		if(!args.length){
			let stdString = "";
			stdString += stdcmd.join('\` \`');
			let devString = "";
			devString += devcmd.join('\` \`');
			let hoardString = "";
			hoardString += hoardcmd.join('\` \`');
			let utilString = "";
			utilString += utilcmd.join('\` \`');
			let pokeString = "";
			pokeString += pokecmd.join('\` \`');

			let embed = new Discord.RichEmbed()
			.setColor('BLUE')
			.setAuthor('Smaug', message.client.users.get(botID).displayAvatarURL)
			.setDescription(`Hey, I'm Smaug the dragon! My current prefix is \`${prefix}\`\nHere are all the magic spells that I know:`)
			.addField('Standard commands', `\`${stdString}\``)
			.addField('Utility commands', `\`${utilString}\``)
			.addField('Hoard commands', `\`${hoardString}\``)
			.addField('Pokemon commands', `\`${pokeString}\``)
			.addField('Developer commands', `\`${devString}\``)
			.setFooter(`Send ${prefix}help [command] for more info on the spell! ^.=.^`);

			return message.channel.send(embed);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if(!command)
			return message.reply("すみません, I've never heard of this spell...maybe it's in the grand book of magic which I'm lazy to read.");
		if(command.hidden)
			return message.reply("すみません, I've never heard of this spell...maybe");

		let embed = new Discord.RichEmbed()
		.setTitle(`\`${command.name}\``);

		if(command.aliases) 	embed.addField(`Aliases`, `\`${command.aliases.join('\` \`')}\``);
		if(command.description) embed.addField(`Description`, command.description);
		if(command.usage) 		embed.addField(`Usage`, `\`${prefix}${command.name} ${command.usage}\``);
		if(command.notes)		embed.addField(`Notes`, command.notes);

		message.channel.send(embed);
	}
};
