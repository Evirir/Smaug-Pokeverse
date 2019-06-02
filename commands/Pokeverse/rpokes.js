const fs = require('fs');
const Pokemons = require('../../pokemons/pokemons.json');
const {titleCase} = require('../../helper.js');

module.exports = {
	name: `rpokes`,
	description: `Refreshes/builds the pokemon database.`,
    aliases: [`rpoke`],
    dev: true,
    notes: `Please run this locally and push the updates manually to Git after using this command.`,

	execute(message, args) {
		let PokeArray = Object.values(Pokemons);
		for(var i=0; i<PokeArray.length; i++) {
			PokeArray[i] = titleCase(PokeArray[i]);
		}
        fs.writeFileSync('./pokemons/pokemonNames.json', JSON.stringify(PokeArray));
        message.channel.send(`Pokemon names array built. Please push the update manually to Git.`);
	}
};
