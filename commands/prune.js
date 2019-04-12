const {prefix,dragID,drag2ID} = require(`../config.json`);

module.exports = {
	name: 'prune',
	description: `Deletes some number of latest messages, not including the ${prefix}prune command (admins and dragons only)`,
	args: true,
	usage: `[amount-of-messages]`,

	execute(message, args){
		if(!message.member.roles.has(`&554922268845670423`) && !message.author.id === dragID && !message.author.id === drag2ID)
			message.reply(`you don't have the permission to do that! Please ask <@dragID> for it.`);

		const amount = parseInt(args[0]);
		if(isNaN(amount)) {
			return message.reply(`that is not a number...`);
		}
		else if(amount < 1 || amount > 99){
			return message.reply('please input a number between 1 and 99.');
		}

		message.channel.bulkDelete(amount+1, true).catch(err => {
			console.error(err);
			message.reply('there was an error trying to prune messages in this channel! Perhaps the messages are more than 2 weeks old.');
		});
  	}
};
