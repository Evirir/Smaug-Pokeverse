const PokeArray = require('../../pokemons/pokemonNames.json');
const Wishlist = require('../../models/wishlist.js');
const WishlistP = require('../../models/wishlistPokemon.js');
const {execute} = require('./pkwishadd.js');

module.exports = {
	name: `wishnone`,
	description: `Removes all Pokémons from your wishlist.`,
    dev: true,

	async execute(message, args) {
        let w = await Wishlist.findOne({userID: message.author.id}).catch(err => console.log(err));
		if(!w){
			return;
		}
        w.wishlist = [];
        w.save().catch(err => console.log(err));

        PokeArray.forEach(async p => {
            let wp = await WishlistP.findOne({name: p}).catch(err => console.log(err));
            if(wp){
                let L = 0, R = wp.wishedBy.length - 1, m = 0;
                while(L<=R) {
                    m = Math.floor((L+R)/2);
                    if(wp.wishedBy[m] === message.author.id){
                        await wp.wishedBy.splice(m, 1);
						await wp.save().catch(err => console.log(err));
						break;
                    }
                    if(wp.wishedBy[m] < message.author.id)	L = m + 1;
                    else R = m - 1;
                }
            }
        });

        message.reply(`you have un-wished for all Pokémons. Oof.`);
	}
};
