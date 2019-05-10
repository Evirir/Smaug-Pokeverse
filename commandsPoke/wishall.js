const mongoose = require('mongoose');
const PokeArray = require('../pokemons/pokemonNames.json');
const Wishlist = require('../models/wishlist.js');
const WishlistP = require('../models/wishlistPokemon.js');
const {execute} = require('./pkwishadd.js');

module.exports = {
	name: `wishall`,
	description: `Adds all Pokemons to your wishlist.`,
	poke: true,
    dev: true,

	async execute(message, args) {
        let w = await Wishlist.findOne({userID: message.author.id}).catch(err => console.log(err));
        if(!w){
            w = new Wishlist({
                userID: message.author.id,
                wishlist: []
            });
        }
        w.wishlist = PokeArray;
        w.save().catch(err => console.log(err));

        PokeArray.forEach(async p => {
            let wp = await WishlistP.findOne({name: p}).catch(err => console.log(err));
            if(!wp){
                let newWishlistP = new WishlistP({
                    name: p,
                    wishedBy: [message.author.id]
                });
                await newWishlistP.save().catch(err => console.log(err));
            }
            else{
                let L = 0, R = wp.wishedBy.length - 1, m = 0, ans = 0;
                let found = false;
                while(L<=R) {
                    m = Math.floor((L+R)/2);
                    if(wp.wishedBy[m] === message.author.id){
                        found = true;
                        break;
                    }
                    if(wp.wishedBy[m] < message.author.id){
                        L = m + 1;
                        ans = m;
                    }
                    else R = m - 1;
                }
                if(!found){
                    await wp.wishedBy.splice(ans + 1, 0, message.author.id);
                    await wp.save().catch(err => console.log(err));
                }
            }
        });

        message.reply(`you have wished for all Pokemons. Wow.`);
	}
};
