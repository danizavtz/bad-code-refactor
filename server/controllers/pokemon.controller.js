(function() {
	'use strict';
	var request = require('request-promise');
	var Sequelize = require('sequelize');
    var sequelize = new Sequelize('pokemons', null, null, {
	    dialect: 'sqlite'
    });
    var Pokemon = sequelize.define('pokemon', {
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		price: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		stock: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 1
		}
	});
	Pokemon.sync({force: true}).then(function () {
		console.log('Model is ready!');
	});

	exports.getAllPokemons = (req, res) =>{
		Pokemon.findAll()
		.then(function listOfPokemons(pokemons){
			if(!pokemons) {
				return res.status(500).send(err);
			}
			res.status(200);
			res.send(pokemons);
			res.end();
		});
	}

	exports.createPokemon = (req, res) => {
		Pokemon.create(req.body)
		.then(function sendPokemon(err,pokemon){
			if(err){
				return res.status(500).send(err);
			}
			res.status(201);
			res.send(pokemon);
			res.end();
		});
	}

	exports.findPokemon = (req, res, next)=>{
		Pokemon.findOne({
		where: {
			name: req.body.name
			}
		})
		.then(function(pokemon) {
			if(!pokemon){
				return res.status(404);//in res.send not found by default
			} else 
			if (pokemon.stock < Math.abs(req.body.quantity)) {
				return res.status(500).send({error: 'Not enought ' + pokemon.name + ' in stock: ' + pokemon.stock });
			} else {
				req.pokemon = pokemon;
				next();
			}
		});
	}

	exports.updatePokemon = (req, res) => {
		request({
			uri: 'https://api.pagar.me/1/transactions',
			method: 'POST',
			json: {
				api_key: process.env.APIKEY,
				amount: req.pokemon.price * Math.abs(req.body.quantity),
				card_number: "4024007138010896",
				card_expiration_date: "1050",
				card_holder_name: "Ash Ketchum",
				card_cvv: "123",
				metadata: {
					product: 'pokemon',
					name: req.pokemon.name,
					quantity: Math.abs(req.body.quantity)
				}
			}
		})
		.then(function (body){
			if (body.status == 'paid') {
				Pokemon.findOne({
				where: {
					name: req.body.name
					}
				}).then(function(pokemon) {
					pokemon.stock = pokemon.stock - Math.abs(req.body.quantity);
					pokemon.save()
					res.status(200);
					return res.send(pokemon);
					
				})
			}
			throw "Rollback transaction";
		})
		.catch(function (err){
			console.log(JSON.stringify(err, null, 4));
			return res.status(err.response.statusCode).send(err.response.body);
		})
	}
})();
