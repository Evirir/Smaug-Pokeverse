const {prefix} = require(`../config.json`);

module.exports = {
	name: 'prefix',
	description: `Shows the current prefix. (Will be able to change prefix soon)`,
	//args: true,
	//usage: `[new-prefix]`,

	execute(message, args){
		/*var newPrefix = args[0];
        if(newPrefix.length > 3){
            return message.channel.send(`Your prefix is too long! Max length: 3`);
        }*/
        message.channel.send(`The current prefix is \`${prefix}\``);
  	}
};
