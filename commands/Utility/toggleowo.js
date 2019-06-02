const Discord = require('discord.js');
const mongoose = require('mongoose');
const Settings = require('../../models/serverSettings.js');

module.exports = {
	name: `toggleowo`,
	description: `Toggles the trigger "owo". If set to true, the bot will respond with uwu/owo when you type owo/uwu, respectively.`,
	aliases: ['owo'],
	usage: `[true/false/t/f/1/0]`,

	async execute(message, args){
		let s = await Settings.findOne({serverID: message.guild.id});
		if(!s) return console.log(`No settings found: toggleowo.js`);
		if(!args.length){
			if(s.owo === undefined){
				s.owo = true;
				s.save().catch(err => console.log(err));
			}

			let embed = new Discord.RichEmbed()
			.setTitle(`owo`)
			.setColor(s.owo? 'GREEN':'RED')
			.addField(`Current setting: ${s.owo}`, `Type ${s.prefix}toggleowo [true/false] to change this setting.`);

			return message.channel.send(embed);
		}

		const state = args[0].toLowerCase();
		let target = true;
		if(state === `true` || state === `t` || state === `1`){
			target = true;
		}
		else if(state === `false` || state === `f` || state === `0`){
			target = false;
		}
		else{
			return message.reply(`invalid arguments. Usage: \`${s.prefix}toggleowo [true/false/t/f/1/0]\``);
		}

		s.owo = target;
		s.save().catch(err => console.log(err));
		let embed = new Discord.RichEmbed()
		.setTitle(`owo settings changed!`)
		.setColor(s.owo? 'GREEN':'RED')
		.setDescription(`Current owo value: ${s.owo}`);

		message.channel.send(embed);
  	}
};
