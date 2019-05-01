module.exports = {
	name: 'finduser',
	description: `Find a user's name based on ID (only works for people I've seen)`,
    aliases: ['findid','fu'],
    args: true,
    usage: '[userID]',

	execute(message, args){
        const client = message.client;
        const targetID = args[0];

        message.channel.send(`The ID ${targetID} belongs to ${client.users.get(targetID).tag}.`);
	}
};
