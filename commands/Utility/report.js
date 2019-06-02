const {dragID} = require(`../../specificData/users.json`);

module.exports = {
	name: `report`,
	description: `Reports a message to the developer, Evirir.`,
	aliases: [`tellevirir`,`telldragon`],
	args: true,
	usage: `[message]`,

	execute(message, args) {

		let msg = message.content;
		let start = msg.indexOf(" ")+1;
		msg = msg.substr(start, msg.length-start);

		message.channel.send(`<@${message.author.id}>, report sent to Evirir!`);
		message.client.fetchUser(dragID).then((user) => {
			user.send(`**${message.author.username}** reported:\n`);
    		user.send(msg);
		});
	}
};
