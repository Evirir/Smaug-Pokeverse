const {consoleID,startupID,betastartupID,messageID,isoBotsID,betatestID} = require(`../channels.json`);

module.exports = {
	name: 'sendch',
	description: `Sends message to specific channel`,
	aliases: [`sendchannel`,`chsend`],
	args: true,
	usage: `[channel ID/name] [message]`,
	admin: true,
	//wip: true,

	execute(message, args) {
		var chID = args[0].toString(); console.log(chID);
		var chName = chID.toLowerCase();
		var isName = false;
		if(chName === `isobots`)	chID = isoBotsID;
		if(chName === `console`)	chID = consoleID;
		if(chName === `startup`)	chID = startupID;
		if(chName === `bstartup`)	chID = betastartupID;
		if(chName === `smaugtest`)	chID = betatestID;
		if(chName === `message`)	chID = messageID;		

		if(!isName)
			chID = chID.substring(2,chID.length-1);

		try{
			var msg = message.content;

			//trims ..sendch command
			var start = msg.indexOf(" ")+1;
			msg = msg.substring(start, msg.length);

			//trims channel, and checks if there's a message
			start = msg.indexOf(" ")+1;
			if(start==0) return message.reply(`please specify your message!`);
			msg = msg.substring(start, msg.length);

			message.client.channels.get(chID).send(msg);
		}
		catch(error){
			return message.channel.send(`Invalid channel! Please input a valid channel ID or an implemented channel name.`);
		}

		message.channel.send(`<@${message.author.id}>, message sent at <#${chID}>!`);
	}
};
