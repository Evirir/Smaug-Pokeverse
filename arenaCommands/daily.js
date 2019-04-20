const Discord = require('discord.js');
const {update} = require('../updateHelper');
const Users = require('../arenaData/UserInv.json');
const ShopList = require('../arenaData/UserInv.json');
const ShopItems = require('../arenaData/UserInv.json');

function timefy(t){
    if(t<10) return '0'+t;
    else return t;
}

const dailyReward = 1000;

module.exports = {
	name: 'daily',
	description: `Claims your daily reward`,
    aliases: ['d'],
    br: true,

	execute (message, args) {
        const user = message.author.id;
        let next = brData[user].nextDaily;
        let now = new Date();

        if(next > now){
            let diffTime = next - now.getTime();
            let diffHr = Math.floor(diffTime/(1000*60*60));
            let tmpMin = diffTime - (diffHr*(1000*60*60));
            let diffMin = Math.floor(tmpMin/(1000*60));
            let tmpSec = tmpMin - (diffMin*(1000*60));
            let diffSec = Math.floor(tmpSec/(1000));

            const embed = new Discord.RichEmbed()
                .setTitle(`Your next daily claim:`)
                .setDescription(`${timefy(diffHr)}:${timefy(diffMin)}:${timefy(diffSec)}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL)
                .setColor('ORANGE');

            return message.channel.send(embed);
        }

        brData[user].bal += dailyReward;
        next = (now.getTime() + (1000*60*60*24));
        brData[user].nextDaily = next;
        update(brData);

        const embed = new Discord.RichEmbed()
            .setTitle(`Daily reward: ${dailyReward} gold coins`)
            .setDescription(`You received **${dailyReward} 💰** as your daily reward!\nYou now have ${brData[user].bal}💰.`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setColor('ORANGE');

        message.channel.send(embed);
	}
};
