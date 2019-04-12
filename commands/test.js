const {prefix,dragID,drag2ID} = require(`../config.json`);

module.exports = {
	name: `test`,
	description: `Detect magic!`,
	aliases: [`detect`,`sense`],

	execute(message, args){
		message.reply(`you sense a surge of magic near you...and it's in front you!\n**IT'S ME, SMAUG!**`);
  	}
};
