const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'prefix',
	description: 'Shows the current prefix if no argument is given. Otherwise, changes server prefix to new prefix.',
	usage: '[new-prefix]',

	execute(message, args){
		let prefixes = JSON.parse(fs.readFileSync('./prefixes.json','utf8'));

		if(!args.length) {
			const embed = new Discord.RichEmbed()
				.setTitle(`Current prefix: ${prefixes[message.guild.id].prefixes}`)
				.setColor('GOLD');

			return message.channel.send(embed);
		}

		if(!message.member.hasPermission('MANAGE_GUILD')){
			return message.reply('you do not have the permission to change the prefix!');
		}

		const newPrefix = args[0];
		prefixes[message.guild.id] = {
			prefixes: args[0]
		};

		fs.writeFile('./prefixes.json', JSON.stringify(prefixes), (err) => {
			if(err) console(err);
		});

		let embed = new Discord.RichEmbed()
			.setColor('GREEN')
			.setTitle(`Prefix set!`)
			.setDescription(`New prefix: ${args[0]}`);

		message.channel.send(embed);
  	}
};
