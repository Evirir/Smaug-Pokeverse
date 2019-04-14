const {consoleID,startupID,betastartupID,messageID,isoBotsID,betatestID} = require(`../channels.json`);

module.exports = {
	name: 'sendch',
	description: `Sends message to specific channel`,
	aliases: [`sendchannel`,`saychannel`,`announce`],
	args: true,
	usage: `[channelID/name] [message]`,
	admin: true,
	wip: true,

	execute(message, args) {
		var chID = args[0];
		var chName = ch.toLowerCase();
		if(chName.includes(`isobot`)) 			chID = isoBotsID;
		else if(chName.includes(`betatest`)) 	chID = betatestID;
		else return message.channel.send(`Invalid channel! Please input a valid channel ID or implemented channnel name.`);

		var msg = message.content;

		//trims ..sendch command
		var start = msg.indexOf(" ")+1;
		msg = msg.substring(start, msg.length);

		//trims channel, and checks if there's a message
		start = msg.indexOf(" ")+1;
		if(start==0) return message.reply(`please specify your message!`);
		msg = msg.substring(start, msg.length);

		message.channel.send(`<@${message.author.id}>, message sent at <#${chID}>!`);
		message.client.channels.get(chID).send(msg);
	}
};
