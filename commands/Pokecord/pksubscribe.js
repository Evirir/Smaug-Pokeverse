const Discord = require('discord.js');
const Subs = require('../../models/pokemonSubscribers.js');
const Settings = require('../../models/serverSettings.js');

module.exports = {
    name: 'pksubscribe',
    description: 'Subscribe to Smaug\'s Pokecord notification. Smaug will DM you everytime a Pokemon spawns in one of your channels.',
    aliases: ['pksub'],
    usage: `[true/false/t/f/1/0]`,

    async execute(message, args) {
        let sb = await Subs.findOne({}).catch(err => console.log(err));
        if(!sb){
            sb = new Subs({subs: []});
        }
        let s = await Settings.findOne({serverID: message.guild.id}).catch(err => console.log(err));
        if(!s) return console.log(`No guild prefix: pksubscribe.js`);

        let hasSubbed = false;
        if(sb.subs.includes(message.author.id)) hasSubbed = true;

        if(!args.length){
            let embed = new Discord.RichEmbed()
            .setAuthor(`Smaug's Pokecord DM Notifications`, message.author.displayAvatarURL)
            .setColor(`GOLD`)
            .setDescription(`By subscribing to this service, Smaug will DM you for every Pokecord Pokemon spawn in any of the channels you have acccess to!`)
            .addField(`${message.author.username}, you are **${hasSubbed? "subscribed":"NOT subscribed"}** to the Pokecord notification service!`, `Type ${s.prefix}pksubscribe [true/false/t/f/1/0] to modify your subscription.`);

            return message.channel.send(embed);
        }

		let state = args[0].toLowerCase(), target = true;
		if(state === `true` || state === `t` || state === `1`){
			target = true;
            if(!hasSubbed) sb.subs.push(message.author.id);
		}
		else if(state === `false` || state === `f` || state === `0`){
			target = false;
            if(hasSubbed){
                sb.subs.splice(sb.subs.findIndex(u => u === message.author.id), 1);
            }
		}
		else{
			return message.reply(`invalid arguments. Usage: \`${s.prefix}pksubscribe [true/false/t/f/1/0]\``);
		}

        await sb.save().catch(err => console.log(err));
        let embed = new Discord.RichEmbed()
        .setAuthor(`Smaug's Pokecord DM Notifications`, message.author.displayAvatarURL)
        .addField(`${message.author.username}, you have now **${target? "subscribed** to":"unsubscribed** from"} the Pokecord notification service!`, `Type ${s.prefix}pksubscribe [true/false/t/f/1/0] to modify your subscription.`);

        if(!target) embed.setColor('RED');
        else embed.setColor('GREEN')

        message.channel.send(embed);
    }
};
