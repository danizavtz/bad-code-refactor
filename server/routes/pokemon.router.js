(function() {
    'use strict';

    const express = require('express');
    const router = express.Router();
    const pokemonController = require('../controllers/pokemon.controller');
    const pokemonValidator = require('../validators/pokemon.validator');

    router.get('/pokemons/', pokemonController.getAllPokemons);
    router.post('/pokemons/', pokemonValidator.pokemonValidate, pokemonController.createPokemon);
    router.put('/pokemons/', pokemonValidator.pokemonFindValidate, pokemonController.findPokemon, pokemonController.updatePokemon);


    module.exports = router;
}());