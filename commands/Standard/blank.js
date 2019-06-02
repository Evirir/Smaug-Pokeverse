module.exports = {
	name: 'blank',
	description: `Spams newlines to cover up whatever terrible things you've said (Doesn't work on mobile).`,
	aliases: [`spamblank`,`cover`,`clear`],
    args: true,
    usage: `[number of lines]`,

	execute(message, args){
        if(args.length > 1) return message.channel.send(`Please input exactly one number!`);
        var amount = parseInt(args[0]);
        if(isNaN(amount)) return message.channel.send(`Please input a valid number!`);
        if(amount < 1 || 100 < amount) return message.channel.send(`Please input a number between 1 and 100!`);

        var msg = "";
        for(let i=0; i<(amount+2); i++)  msg += "** **\n";
        message.channel.send(msg);
	}
};
