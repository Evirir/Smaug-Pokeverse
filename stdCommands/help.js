const Discord = require('discord.js');
const {defaultPrefix} = require('../config.json');
const {dragTag, botID} = require(`../specificData/users.json`);
const fs = require('fs');
const prefixes = JSON.parse(fs.readFileSync("./prefixes.json","utf8"));

module.exports = {
	name: 'help',
	description: `Shows list of spells that I know. Use \`${defaultPrefix}help [spell]\` to view details of the spell.\n(Also, nice job on getting help on a help command)`,
	aliases: ['commands','command','cmd'],
	usage: '[spell-name]',

	execute(message, args){
		const prefix = prefixes[message.guild.id].prefix;
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
			data.push(`Hey, I'm Smaug the dragon! My current prefix is \`${prefix}\``);
			data.push(`Here are all the magic spells that I know:`);
			data.push(`\n**Standard commands:\n**\``);
			data.push(stdcmd.join('\` \`'));
			data.push(`\`\n\n**Developer commands:\n**\``);
			data.push(devcmd.join('\` \`'));
			data.push(`\`\n\n**Hoard commands:\n**\``);
			data.push(hoardcmd.join('\` \`'));
			data.push(`\`\n\nSend \`${prefix}help [command]\` for more info on that spell!`);
			data.push(`If you forgot the prefix, you can always type "<@${botID}> help" to summon this message!`);

			return message.channel.send(data, {split: true});
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
