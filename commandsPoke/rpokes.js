const fs = require('fs');
const Pokemons = require('../pokemons/pokemons.json');

function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   return splitStr.join(' ');
}

module.exports = {
	name: `rpokes`,
	description: `Refreshes/builds the pokemon database.`,
    aliases: [`rpoke`],
	poke: true,
    dev: true,
    notes: `Please run this locally and push updates to Git after using this command.`,

	execute(message, args) {
		let PokeArray = Object.values(Pokemons);
		for(var i=0; i<PokeArray.length; i++) {
			PokeArray[i] = titleCase(PokeArray[i]);
		}
        fs.writeFileSync('./pokemons/pokemonNames.json', JSON.stringify(PokeArray));
        message.channel.send(`Pokemon names array built. Please push the update manually to Git.`);
	}
};
