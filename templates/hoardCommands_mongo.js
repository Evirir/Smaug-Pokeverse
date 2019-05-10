const mongoose = require('mongoose');
const Money = require('../models/money.js');

module.exports = {
	name: 'name',
	description: `description`,
    aliases: ['alias1','alias2'],
    hoard: true,

	execute(message, args){
        //do something
	}
};
