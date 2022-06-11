//Import d'express
const express = require('express');

//Import de body-parser installé ds backend via "npm install body-parser --save"
const bodyParser = require('body-parser');

//Import du router pour stuff
const stuffRoutes = require('./routes/stuff');

//Import du router user
const userRoutes = require('./routes/user');

//Import de mongoose + connection via sa méthode connect()
const mongoose = require('mongoose');

//Import de path permettant config URL pour gestion des fichiers users (images ajoutées)
const path = require('path');

// variable d'environnement pour masquer code de connection à mongoDB
require('dotenv').config();

mongoose.connect(
  process.env.PASSWORD, 
  {useNewUrlParser : true ,  
  useUnifiedTopology: true}
)
.then(() => console.log('Connexion à mongoDB réussie'))
.catch(() => console.log('Connexion à mongoDB échouée'));

// 2) appel de la méthode express
const app = express();

//MIDDLEWARES
//9-Middleware général pouvant gérer l'erreur CORS ou cross origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


//middleware prenant en compte multer et les modifs sur route put de stuffctrler
app.use('/image', express.static(path.join(__dirname, 'image')));

//Middleware pour bodyparser qui transforme le corps de la requête en objet JS utilisable
app.use(bodyParser.json());

//Réécriture des middlewares avec le router de stuff.js
app.use('/api/stuff' , stuffRoutes);

//Enregistrement route user
app.use('/api/auth' , userRoutes)

// 3) export de l'application express
module.exports = app;