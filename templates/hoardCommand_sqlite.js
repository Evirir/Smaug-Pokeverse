const {Users, CurrencyShop} = require('../dbObjects');

module.exports = {
	name: 'name',
	description: `description`,
    aliases: ['alias1','alias2'],
    br: true,

	execute(UserData, message, args){
        //do something
	}
};
