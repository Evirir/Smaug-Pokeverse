var fs = require('fs');
const {dragToken,drag2Token,botToken} = require(`../config.json`);

module.exports = {
    name: 'switch',
    description: 'Assumes a different identity',
    aliases: [`identity`,`toggle`],
    args: true,
    usage: `[identity]`,
    admin: true,
    hidden: true,

	execute(message, args) {
        var cur = fs.readFileSync('status.txt', 'utf8');
        var tgt = args[0].toLowerCase();
        var token = "";

		if(cur === tgt)
            return message.channel.send(`<@${message.author.id}>, you are already using this identity!`);

        if(tgt === `evirir`){
            fs.writeFileSync('status.txt',`evirir`);
            token = dragToken;
        }
        else if(tgt === `gariffred`){
            fs.writeFileSync('status.txt',`gariffred`);
            token = drag2Token;
        }
        else if(tgt === `smaug`){
            fs.writeFileSync('status.txt',`smaug`);
            token = botToken;
        }
        else return message.channel.send(`<@${message.author.id}>, please input a valid identity!`);

        message.channel.send(`Identity switch! I've taken over ${tgt.charAt(0).toUpperCase() + tgt.slice(1)}'s body... O.=.o`);
        message.client.destroy();
	}
};
