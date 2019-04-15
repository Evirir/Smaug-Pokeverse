const {consoleID,startupID,betastartupID,messageID,isoBotsID,betatestID} = require(`../channels.json`);

module.exports = {
	name: 'sendch',
	description: `Sends message to specific channel`,
	aliases: [`sendchannel`,`chsend`],
	args: true,
	usage: `[channel ID/name] [message]`,
	admin: true,
	notes: `Usable names: isobots/botsiso, console, startup, bstartup, smaugtest, message`,

	execute(message, args) {
		var chID = args[0].toString();
		var chName = chID.toLowerCase();
		var isName = false;
		if(chName === `isobots` || chName === `botsiso`)	chID = isoBotsID; isName = true;
		if(chName === `console`)	chID = consoleID; isName = true;
		if(chName === `startup`)	chID = startupID; isName = true;
		if(chName === `bstartup`)	chID = betastartupID; isName = true;
		if(chName === `smaugtest`)	chID = betatestID; isName = true;
		if(chName === `message`)	chID = messageID; isName = true;

		if(!isName)
			chID = chID.substring(2,chID.length-1);

		try{
			var msg = message.content;

			//trims ..sendch command
			var start = msg.indexOf(" ")+1;
			msg = msg.substring(start, msg.length);

			//trims channel, and checks if there's a message
			start = msg.indexOf(" ")+1;
			if(start==0) return message.channel.send(`<@${message.author.id}>, please specify your message!`);
			msg = msg.substring(start, msg.length);

			message.client.channels.get(chID).send(msg);
		}
		catch(error){
			return message.channel.send(`Invalid channel! Please input a valid channel ID or an implemented channel name.`);
		}

		message.channel.send(`<@${message.author.id}>, message sent at <#${chID}>!`);
	}
};
