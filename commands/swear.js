module.exports = {
    name: 'swear',
    aliases: [`shit`,`fuck`,`damn`],
    hidden: true,

	execute(message, args){
	    message.channel.send(`Damn it <@${message.author.id}>, why the f**k did you use me to swear?!`);
        message.channel.send(`(Also congrats for finding this secret commmand, you sucker.)`);
	}
};
