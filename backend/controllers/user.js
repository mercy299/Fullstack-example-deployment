//Import du modele User.js
const User = require('../models/User');
const bcrypt = require('bcrypt');  //Package de cryptage bcrypt à installer via terminal avec npm install --save bcrypt
//Package jsonwebtoken required pour l'authentification via token de la fonction token
const jwt = require('jsonwebtoken');

//Préparation des fonctions middlewares, logiques métier des routes pour création de users
//Fonctions signup et login

//Fonction signup logique sur le password crypté
exports.signup = (req, res, next) => {
 //fonction de hash du mot de passe
 bcrypt.hash(req.body.password, 10)
  .then(hash => {
      const user = new User({
          email: req.body.email,
          password: hash
      });
      user.save()
       .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
       .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};

/*
Dans cette fonction signup:

=> nous appelons la fonction de hachage de bcrypt dans notre mot de passe

et lui demandons de « saler » le mot de passe 10 fois. 

Plus la valeur est élevée, plus l'exécution de la fonction sera longue,

et plus le hachage sera sécurisé. Pour plus d'informations, consultez la documentation de bcrypt ;

=> il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle 

nous recevons le hash généré ;

=> dans notre bloc then , nous créons un utilisateur et l'enregistrons 

dans la base de données, en renvoyant une réponse de réussite en cas de succès, 

et des erreurs avec le code d'erreur en cas d'échec ;
*/



//Fonction login permettant aux users existants de se connecter
exports.login = (req, res, next) => {
 //Trouver le user ds la BD qui match avec le usermail
 User.findOne({ email: req.body.email })
  .then(user => {
      if(!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !'});
      }
      bcrypt.compare(req.body.password, user.password)
       .then(valid => {
           if(!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !'}) 
           }
           res.status(200).json({
               userId: user._id,
               token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h'}
               )
           });
       })
       .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));

};



/*

Dans le code ci-dessus : FONCTION LOGIN

=> nous utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données :

a) dans le cas contraire, nous renvoyons une erreur 401 Unauthorized ,

b) si l'e-mail correspond à un utilisateur existant, nous continuons ;

nous utilisons la fonction compare debcrypt pour comparer le mot de passe entré par l'utilisateur avec 

le hash enregistré dans la base de données :

a) s'ils ne correspondent pas, nous renvoyons une erreur 401 Unauthorized et un message « Mot de passe incorrect ! » ;

b) s'ils correspondent, les informations d'identification de notre utilisateur sont valides. 

Dans ce cas, nous renvoyons une réponse 200 contenant l'ID utilisateur et un token. 


//jwt.sign() => 3 arguments:
//payload données à encoder => encodage userId nécessaire !!!
//clé secrète pour l'encodage
//Argument de configuration temps de validité du TOKEN


CREATION TOKENS D'AUTHENTIFICATION:

Les tokens d'authentification permettent aux utilisateurs de ne se connecter qu'une seule fois à leur compte. 

Au moment de se connecter, ils recevront leur token et le renverront 

automatiquement à chaque requête par la suite. 

Ceci permettra au back-end de vérifier que la requête est authentifiée.



TOKENS ET FONCTION LOGIN:

=> nous utilisons la fonction sign de jsonwebtoken pour encoder un nouveau token ;

=> ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token) ;

=> nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token 

(à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;

=> nous définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures ;

=> nous renvoyons le token au front-end avec notre réponse.

Les tokens d'authentification permettent aux utilisateurs de ne se 

connecter qu'une seule fois à leur compte. Au moment de se connecter, 

ils recevront leur token et le renverront automatiquement à chaque requête par la suite.

Ceci permettra au back-end de vérifier que la requête est authentifiée. 

Vous pouvez désormais utiliser l'onglet « Réseau » de Chrome DevTools pour vérifier que, 

une fois connecté, chaque requête provenant du front-end contient bien un en-tête « Authorization » 

avec le mot-clé « Bearer » et une longue chaîne encodée. Il s'agit de notre token !

*/