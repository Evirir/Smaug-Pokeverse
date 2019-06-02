const Discord = require('discord.js');
const fs = require('fs');
const {defaultPrefix} = require('../../config.json');
const {dragTag, botID} = require(`../../specificData/users.json`);

const Settings = require('../../models/serverSettings.js');
const {Categories} = require('../../config.json');

module.exports = {
	name: 'help',
	description: `Shows list of spells that I know. Use \`${defaultPrefix}help [spell]\` to view details of the spell.`,
	aliases: ['commands','command','cmd'],
	usage: '[spell-name]',
	notes: `(Also, nice job on getting help on a help command)`,

	async execute(message, args, prefix){
		if(!args.length){
			let embed = new Discord.RichEmbed()
			.setColor('BLUE')
			.setAuthor('Smaug', message.client.users.get(botID).displayAvatarURL)
			.setDescription(`Hey, I'm Smaug the dragon! My current prefix is \`${prefix}\`\nHere are all the magic spells that I know:`)
			.setFooter(`Send ${prefix}help [command] for more info on the spell! ^.=.^`);

			let devArray = [];

			Categories.forEach(category => {
				const commandFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
				let commandArray = [];
				commandFiles.forEach(file => {
					const command = require(`../${category}/${file}`);
					if(command.dev) devArray.push(command.name);
					else if(!command.hidden)	commandArray.push(command.name);
				});
				embed.addField(`${category} commands`, `\`${commandArray.join('` `')}\``)
			});

			embed.addField(`Developer commands`, `\`${devArray.join('` `')}\``);

			return message.channel.send(embed);
		}
		
		const {commands} = message.client;
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if(!command)
			return message.reply("I've never heard of this spell...maybe it's in the grand book of magic which I'm lazy to read.");
		if(command.hidden)
			return message.reply("I've never heard of this spell...maybe.");

		let embed = new Discord.RichEmbed()
		.setTitle(`\`${command.name}\``)
		.setColor('BLUE')
		.setFooter(`Note: If an argument is a user, you can either use a user mention, user tag or user ID.`);

		if(command.aliases) 	embed.addField(`Aliases`, `\`${command.aliases.join('\` \`')}\``);
		if(command.description) embed.addField(`Description`, command.description);
		if(command.usage) 		embed.addField(`Usage`, `\`${prefix}${command.name} ${command.usage}\``);
		if(command.cd)			embed.addField(`Cooldown`, `\`${parseFloat(command.cd.toFixed(1))}s\``);
		if(command.notes)		embed.addField(`Notes`, command.notes);

		message.channel.send(embed);
	}
};
