//Préparation du schéma de données pour créer des users
const mongoose = require('mongoose');

//Utilisation du package mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

//Fonction .Schema() de mongoose pour créer schéma users
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String,  required: true}
});

//application de uniquevalidator sur le schéma en plugin => avec email: unique true, on est sur de ne pas avoir many users = same adress
userSchema.plugin(uniqueValidator);

//export du schéma de données User créé
module.exports = mongoose.model('User' , userSchema);

/*
Pour s'assurer que deux utilisateurs ne peuvent pas utiliser la même adresse e-mail, 
nous utiliserons le mot clé unique pour l'attribut email du schéma d'utilisateur userSchema
Les erreurs générées par défaut par MongoDB pouvant être difficiles à résoudre, 
nous installerons un package de validation pour pré-valider les informations avant de les enregistrer

Dans notre schéma, la valeur unique , avec l'élément mongoose-unique-validator passé comme plug-in, 
s'assurera qu'aucun des deux utilisateurs ne peut partager la même adresse e-mail.

Shéma de données prêt pour pouvoir ensuite enregistrer les nouveaux utilisateurs 
dans notre base de données et appliquer le chiffrement de mot de passe.
*/