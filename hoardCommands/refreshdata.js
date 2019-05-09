const mongoose = require('mongoose');


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
