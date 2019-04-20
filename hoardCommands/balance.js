const fs = require('fs');

module.exports = {
	name: 'balance',
	description: `Checks someone's hoard balance`,
    aliases: ['b','bal','money'],
    hoard: true,
	wip: true,

	execute(currency, message, args){
        const target = message.mentions.users.first() || message.author;
		if(target === message.author)
        	return message.reply(`you have **${currency.getBalance(target.id)} gold coins** 💰 in your hoard.`);
		return message.reply(`**${target.tag}** has **${currency.getBalance(target.id)} gold coins** 💰 in his hoard.`);
    }
};
