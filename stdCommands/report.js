const {dragID,dragTag} = require(`../users.json`);

module.exports = {
	name: `report`,
	description: `Delivers a DM message to @${dragTag} via a dragon courier.`,
	aliases: [`tellevirir`,`telldragon`],
	args: true,
	usage: `[message]`,

	execute(message, args) {

		let msg = message.content;
		let start = msg.indexOf(" ")+1;
		msg = msg.substr(start, msg.length-start);

		message.channel.send(`A dragon courier flies towards you, carefully writes down your message, bows, takes your cookie and flies away swiftly...`);
		message.channel.send(`<@${message.author.id}>, message sent to Evirir!`);
		message.client.fetchUser(dragID).then((user) => {
			user.send(`**${message.author.tag}** reported:\n`);
    		user.send(msg);
		});
	}
};
