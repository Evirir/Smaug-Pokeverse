const {prefix,dragID,drag2ID} = require(`../config.json`);

module.exports = {
	name: `test`,
	description: `Detect magic!`,

	execute(message, args){
		message.channel.send(`Yes <@${message.author.id}>, I'm here!`);
  	}
};
