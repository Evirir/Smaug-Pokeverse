const {dragID} = require(`../users.json`);

module.exports = {
	name: 'prune',
	description: `Deletes some number of latest messages (members with \`MANAGE_MESSAGES\` permission only)`,
	args: true,
	usage: `[amount]`,

	execute(message, args){
		if(!message.member.hasPermission('MANAGE_MESSAGES',false,true,true))
			return message.reply(`you must be an admin to do that! Please ask for the admins' permission and <@${dragID}>'s help for it.`);

		const amount = parseInt(args[0]);
		if(isNaN(amount)) {
			return message.reply(`please input a valid number.`);
		}
		else if(amount < 1 || amount > 99){
			return message.reply('please input a number between 1 and 99.');
		}

		message.channel.bulkDelete(amount+1, true).catch(err => {
			console.error(err);
			return message.reply('there was an error trying to prune messages in this channel! Perhaps the messages are more than 2 weeks old.');
		});
  	}
};
