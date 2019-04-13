const {prefix,dragID,drag2ID} = require(`../users.json`);

module.exports = {
	name: 'prune',
	description: `Deletes some number of latest messages (admins and dragons only)`,
	args: true,
	usage: `[amount]`,

	execute(message, args){
		if(!(message.member.roles.find(r => r.name.toLowerCase().includes(`admin`)) || message.author.id === dragID))
			message.reply(`you must be an admin to do that! Please ask for the admins' permission and <@${dragID}>'s help for it.`);

		const amount = parseInt(args[0]);
		if(isNaN(amount)) {
			return message.reply(`please input a valid number.`);
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
