const Discord = require('discord.js');
const {defaultPrefix} = require('../../config.json');

module.exports = {
	name: 'roll',
	description: `Rolls a number of dice of specified type.`,
    aliases: [`rolls`,`dice`,`rand`,`random`],
	args: true,
	usage: `[amount]d[faces]\` e.g. \`${defaultPrefix}roll d8\` \`${defaultPrefix}roll 4d10`,

	execute(message, args){
		const limit = 200;

		const dice = args[0];
		if(!dice.includes('d')) return message.channel.send(`Invalid format! Usage: \`\[no of dice]d[type of dice]\``);

		const cut = dice.indexOf('d');
		if(cut === dice.length-1) return message.channel.send(`Invalid format! Usage: \`\[no of dice]d[type of dice]\``);

		const amount = (cut == 0) ? 1 : parseInt(dice.substring(0,cut));
		const type = parseInt(dice.substring(cut+1,dice.length));
		if(isNaN(amount) || isNaN(type)) return message.channel.send(`Invalid format! Usage: \`\[no of dice]d[type of dice]\``);
		if(amount < 1 || limit < amount || type < 1 || limit < type) return message.channel.send(`Please input an amount between 1 and ${limit}!`);

		var res = new Array(amount);
		var sum = 0;
		const mini = amount;
		const maxi = amount*type;
		const ave = (mini + maxi) / 2;


		for(var i=0; i<amount; i++){
			let rand = Math.random() * type;
			rand = Math.floor(rand) + 1;
			res[i] = rand;
			sum += res[i];
		}

		let title = `Result: ${sum}`;
		let desc = (amount==1) ? "" : `Rolls: ${res.join(', ')}\n`;
		let footnote = `Min: ${mini}  Max: ${maxi}  Ave: ${ave}`;

		let mid = (mini+maxi)/2;
		let chg = (sum/maxi);
		let rchg = 0; let gchg = 0;
		if(chg<0.5)
			gchg = 0.5 - chg;
		else
			rchg = chg - 0.5;

		const embed = new Discord.RichEmbed()
		.setTitle(title)
		.setDescription(desc)
		.setFooter(footnote)
		.setColor([255*(1-rchg),255*(1-rchg),0]);

		message.channel.send(embed);
	}
};
