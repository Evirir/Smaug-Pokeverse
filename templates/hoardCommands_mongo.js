const mongoose = require('mongoose');
const {uri} = require('../config.json');
mongoose.connect('mongodb+srv://Evirir:%40%24dfGhjkl%31%32%33@smaug-uq5av.mongodb.net/test?retryWrites=true', {useNewUrlParser: true}).catch(err => console.log(err));

module.exports = {
	name: 'name',
	description: `description`,
    aliases: ['alias1','alias2'],
    hoard: true,

	execute(message, args){
        //do something
	}
};
