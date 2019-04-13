const {consoleID} = require(`../channels.json`);

module.exports = {
	name: 'ping',
	description: `"Reports the latency and API latency"...that's what the magic book says, whatever that means`,

	execute(message,args){
	    message.channel.send(`Pong! API Latency is ${Math.round(message.client.ping)}ms.`);
	    message.channel.get(consoleID).send(`\nPing used at ${message.channel.name} in ${message.guild.name}: API Latency is ${Math.round(delay)}ms.`);
	}
};
