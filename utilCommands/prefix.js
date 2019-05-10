const Discord = require('discord.js');
const mongoose = require('mongoose');

const Prefix = require('../models/prefix.js');

module.exports = {
	name: 'prefix',
	description: 'Shows the current prefix if no argument is given. Otherwise, changes server prefix to new prefix.',
	usage: '[new-prefix]',
	util: true,

	execute(message, args, prefix){
		if(!args.length) {
			const embed = new Discord.RichEmbed()
				.setTitle(`Current prefix: \`${prefix}\``)
				.setDescription(`Type \`${prefix}prefix [new-prefix]\` to change prefix.`)
				.setColor('GOLD');

			return message.channel.send(embed);
		}

		if(!message.member.hasPermission('MANAGE_GUILD')){
			return message.reply('you do not have the permission to change the prefix!');
		}

		Prefix.findOne({serverID: message.guild.id}, (err, p) => {
			if(err) return console.log(err); if(!p) return console.log(`No guild prefix found: dm.js`);
			p.prefix = args[0];
			p.save().catch(err => {console.log(err); message.channel.send(`Error: prefix.js`);});

			let embed = new Discord.RichEmbed()
				.setColor('GREEN')
				.setTitle(`Prefix set!`)
				.setDescription(`New prefix: ${p.prefix}`);

			message.channel.send(embed);
		});
  	}
};
