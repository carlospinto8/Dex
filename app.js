const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios").default;

const app = express();

const url = "https://pokeapi.glitch.me/v1/pokemon/" //"https://pokeapi.co/api/v2/pokemon/";
const pokemon = [];

app.set("view engine", "ejs");

// Use this so you can access req.body
app.use(bodyParser.urlencoded({ extended: true }));

// This is so you can use static files like your css styles
app.use(express.static("public"));

app.get("/", function (req, res) {

    if(pokemon.length !== 0) {
        pokemon.splice(0, pokemon.length);
    }

    res.render("index");
});

app.post("/", function (req, res) {
    const pokemonName = req.body.pokemonName;
    
    axios.get(url + pokemonName)
        .then(function (res) {
            // Handle success
            console.log(res);
            console.log(typeof res.data);
            console.log(res.data[0]);
            console.log(res.data[0].types);
            // res.data will store all the data you got in response. duh.
            pokemon.push(res.data[0].name);
            pokemon.push(res.data[0].sprite);
            
            pokemon.push(res.data[0].species);
            pokemon.push(res.data[0].height);
            pokemon.push(res.data[0].weight);
            pokemon.push(res.data[0].description)
            pokemon.push(res.data[0].types[0]); //Threw an error don't forget to check this

            if (res.data[0].types.length === 2) {
                 pokemon.push(res.data.types[1]);
            } else {
                pokemon.push("None");
            }

            console.log(pokemon[1]);

        })
        .catch(function (error) {
            // Handle Error
            console.log(error);
        })
        .then(function () {
            // Finally, ALWAYS execute this
            res.redirect("/pokemon");
        });

});

app.get("/pokemon", function(req, res) {
    res.render("pokemon", { 
        pokemonName: pokemon[0], 
        pokemonPrimaryType: pokemon[6], 
        pokemonSecondaryType: pokemon[7],
        pokemonImage: pokemon[1],
        pokemonSpecies: pokemon[2],
        pokemonHeight: pokemon[3],
        pokemonWeight: pokemon[4],
        pokemonDescription: pokemon[5]
    });
});

app.listen(3000, function () {
    console.log("Listening on 3000");
});