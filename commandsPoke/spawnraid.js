const mongoose = require('mongoose');
const Raider = require('../models/pokeverseRaider.js');

module.exports = {
	name: `spawnraid`,
	description: `Fake spawns a Raider pokemon for testing.`,
    aliases: [`spawnraider`,`spr`],
	poke: true,
    dev: true,

	async execute(message, args) {
        let raider = await Raider.findOne({channelID: message.channel.id}).catch(err => console.log(err));
        if(!raider){
            let newRaider = new Raider({
                channelID: message.channel.id,
                hasRaider: true,
                activeUserID: null
            });
            raider = newRaider;
        }

        raider.hasRaider = true;
        await raider.save().catch(err => console.log(err));
        return message.channel.send(`A Raider spawned! Except it's a simulation...`);
	}
};
