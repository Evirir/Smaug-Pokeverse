module.exports = {
	name: 'poem',
	description: `Introduces myself in a nice, poetic way u.=.u`,
    aliases: [`smauglong`,`introlong`],

	execute(message, args){
	    message.channel.send(`*My armor is like tenfold shields,\nmy teeth are swords,\nmy claws spears,\nthe shock of my tail a thunderbolt,\nmy wings a hurricane,\nand my breath death!*`);
	}
};
