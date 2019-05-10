const Discord = require('discord.js');
const {defaultPrefix} = require('../config.json');
const {dragTag, botID} = require(`../specificData/users.json`);

//const mongoose = require('mongoose');
const Prefix = require('../models/prefix.js');

module.exports = {
	name: 'help',
	description: `Shows list of spells that I know. Use \`${defaultPrefix}help [spell]\` to view details of the spell.\n(Also, nice job on getting help on a help command)`,
	aliases: ['commands','command','cmd'],
	usage: '[spell-name]',

	async execute(message, args){
		let prefix = ",,";
		const p = await Prefix.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(p) prefix = p.prefix;

		const data = [];
		const {commands} = message.client;

		let cmd = commands.map(command => command);
		let stdcmd = [];
		let devcmd = [];
		let hoardcmd = [];

		for(var i=0; i<cmd.length; i++){
			if(!cmd[i].hidden){
				if(cmd[i].dev) devcmd.push(cmd[i].name);
				else if(cmd[i].hoard) hoardcmd.push(cmd[i].name);
				else stdcmd.push(cmd[i].name);
			}
		}

		if(!args.length){
			let stdString = "";
			stdString += stdcmd.join('\` \`');
			let devString = "";
			devString += devcmd.join('\` \`');
			let hoardString = "";
			hoardString += hoardcmd.join('\` \`');

			let embed = new Discord.RichEmbed()
			.setColor('BLUE')
			.setAuthor('Smaug', message.client.users.get(botID).displayAvatarURL)
			.setDescription(`Hey, I'm Smaug the dragon! My current prefix is \`${prefix}\`\nHere are all the magic spells that I know:`)
			.addField('Standard commands', `\`${stdString}\``)
			.addField('Developer commands', `\`${devString}\``)
			.addField('Hoard commands', `\`${hoardString}\``)
			.setFooter(`Send ${prefix}help [command] for more info on the spell! ^.=.^`);

			return message.channel.send(embed);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if(!command)
			return message.reply("すみません, I've never heard of this spell...maybe it's in the grand book of magic which I'm lazy to read.");
		if(command.hidden)
			return message.reply("すみません, I've never heard of this spell...maybe");

		data.push(`**Name:** \`${command.name}\``);
		if(command.aliases) 	data.push(`**Aliases:** \`${command.aliases.join('\` \`')}\``);
		if(command.description) data.push(`**Description:** ${command.description}`);
		if(command.usage) 		data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);
		if(command.notes)		data.push(`**Notes:** ${command.notes}`);

		message.channel.send(data,{split: true});
	}
};
