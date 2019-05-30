const Discord = require('discord.js');
const mongoose = require('mongoose');
const Settings = require('../models/serverSettings.js');

module.exports = {
	name: 'prefix',
	description: 'Shows the current prefix if no argument is given. Otherwise, changes server prefix to new prefix.',
	usage: '[new-prefix]',
	util: true,

	async execute(message, args, prefix){
		if(!args.length) {
			const embed = new Discord.RichEmbed()
				.setTitle(`Current prefix: \`${prefix}\``)
				.setDescription(`Type \`${prefix}prefix [new-prefix]\` to change prefix.`)
				.setColor('GOLD');

			return message.channel.send(embed);
		}

		if(!message.member.hasPermission('MANAGE_GUILD')){
			return message.reply('you the \`MANAGE SERVER\` permission to change the prefix!');
		}

		let p = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
		if(!p) return console.log(`No guild prefix found: dm.js`);
		p.prefix = args[0];
		p.save().catch(err => console.log(err));

		let embed = new Discord.RichEmbed()
		.setColor('GREEN')
		.setTitle(`Prefix set!`)
		.setDescription(`New prefix: ${p.prefix}`);

		message.channel.send(embed);
  	}
};
