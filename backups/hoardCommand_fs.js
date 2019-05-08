const fs =  require('fs');
const {update} = require('../updateHelper');
const UserData = JSON.parse(fs.readFileSync('./arenaData/UserInv.json','utf8'));
const ShopList = JSON.parse(fs.readFileSync('./arenaData/ShopList.json','utf8'));
const ShopItems = JSON.parse(fs.readFileSync('./arenaData/ShopItems.json','utf8'));

module.exports = {
	name: 'name',
	description: `description`,
    aliases: ['alias1','alias2'],
    br: true,

	execute (message, args) {

	}
};
