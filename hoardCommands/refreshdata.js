const mongoose = require('mongoose');
const {uri} = require('../config.json');
mongoose.connect(uri, {useNewUrlParser: true}).catch(err => console.log(err));
const Money = require('../models/money.js');

module.exports = {
    name: 'refreshdata',
    description: 'Refreshes shop database',
    hoard: true,
    wip: true,

    execute (message, args) {
        message.channel.send(`Does nothing yet`);
    }
};
