const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios").default;

const app = express();

const url = "https://pokeapi.co/api/v2/pokemon/";
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

            // res.data will store all the data you got in response. duh.
            pokemon.push(res.data.name);
            pokemon.push(res.data.sprites.front_default);
            pokemon.push(res.data.types[0].type.name);

            if (res.data.types.length === 2) {
                 pokemon.push(res.data.types[1].type.name);
            } else {
                pokemon.push("none");
            }

            console.log(pokemon[0] + " " + pokemon[2] + " " + pokemon[3]);

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
    res.render("pokemon", { pokemonName: pokemon[0], pokemonPrimaryType: pokemon[2], pokemonSecondaryType: pokemon[3]});
});

app.listen(3000, function () {
    console.log("Listening on 3000");
});