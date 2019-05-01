module.exports = {
	name: 'finduser',
	description: `Find a user's name based on ID (only works for people I've seen)`,
    aliases: ['findid','fu'],
    args: true,
    usage: '[userID]',

	execute(message, args){
        const client = message.client;
        const targetID = args[0];

        if(!client.users.get(targetID)) return message.reply(`this user ID does not exist, or I do not have access to this user.`);

        message.channel.send(`The ID ${targetID} belongs to ${client.users.get(targetID).tag}.`);
	}
};
