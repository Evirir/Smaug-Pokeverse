module.exports = {
	name: 'blank',
	description: `Spams newlines to cover up whatever terrible things you've said.`,
	aliases: [`spamblank`,`cover`,`clear`],
    args: true,
    usage: `[number of lines]`,

	execute(message, args){
        if(args.length > 1) return message.channel.send(`Please input exactly one number!`);
        var amount = args[0];
        if(isNaN(amount)) return message.channel.send(`Please input a valid number!`);
        if(amount < 1 || 100 < amount) return message.channel.send(`Please input a number between 1 and 100!`);

        var msg = ".";
        for(var i=0; i<amount+2; i++)  msg += '\n';
        msg += `*(${amount} line`;
        if(amount==1) msg += `of boring blanks)*`;
        else msg += `s of boring blanks)*`;
        message.channel.send(msg);
	}
};
