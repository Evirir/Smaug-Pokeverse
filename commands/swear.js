module.exports = {
    name: 'swear',
    description: `In case someone thought of this...`,
    aliases: [`shit`,`fuck`,`damn`,`ffs`,`fk`],
    hidden: true,

	execute(message, args){
	    message.channel.send(`Damn it <@${message.author.id}>, why the f**k did you use me to swear?!`).then(msg => msg.delete(5000));
        message.channel.send(`(Also congrats for finding this secret command, you sucker.)`).then(msg => msg.delete(5000));
	}
};
