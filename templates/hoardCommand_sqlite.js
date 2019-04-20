const {Users, CurrencyShop} = require('../dbObjects');

module.exports = {
	name: 'name',
	description: `description`,
    aliases: ['alias1','alias2'],
    hoard: true,

	execute(currency, message, args){
        //do something
	}
};
