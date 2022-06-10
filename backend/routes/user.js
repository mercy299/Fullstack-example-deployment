//Création du Router avec Express
const express = require('express');
const router = express.Router();

//Import du controller => Association des fonctions logique métier au router
const userCtrl = require('../controllers/user');

//Ecriture des routes POST envoyés par le frontend (login+password) à la connexion du user
router.post('/signup' , userCtrl.signup);
router.post('/login' , userCtrl.login);

//Export du router pour pouvoir l'importer dans app.js
module.exports = router;