# Mise en place de server.js

Il s'agit du server Node.

Node est le runtime qui permet d'écrire toutes nos tâches côté serveur, en JavaScript, telles que la logique métier, la persistance des données et la sécurité. Node ajoute également des fonctionnalités que le JavaScript du navigateur standard ne possède pas, comme par exemple l'accès au système de fichiers local


INITIALISATION DU PROJET OU DEMARRAGE DU SERVER NODE

Ce processus génère un fichier package.json vierge, dans lequel seront enregistrés les détails de tous les packages npm que nous utiliserons pour ce projet

=> Dans sous dossier "backend" npm init
=> entrée 'till point d'entrée et nommer "server.js" (à créer then)
=> ds "backend" git init puis créer un fichier ".gitignore"
=> Créer un fichier server.js dans "backend"

Code à mettre dans server.js

a => const http = require('http');

b => const server = http.createServer(
    c => (req, res) => 
    {
     d => res.end('Voilà la réponse du serveur !');
    }
);

e => server.listen(process.env.PORT || 3000);

a)Ici, vous importez le package HTTP natif de Node. 

b)Vous l'utilisez pour créer un serveur, en passant une fonction qui sera exécutée à chaque appel effectué vers ce serveur. 

c)Cette fonction reçoit les objets request et response en tant qu'arguments. 

d)Dans cet exemple, vous utilisez la méthode end de la réponse pour renvoyer une réponse de type string à l'appelant.

e)Dans la dernière ligne, vous configurez le serveur pour qu'il écoute :

1) soit la variable d'environnement du port grâce à process.env.PORT : si la plateforme de déploiement propose un port par défaut, c'est celui-ci qu'on écoutera ;

2) soit le port 3000, ce qui nous servira dans le cas de notre plateforme de développement.

https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb/6466231-demarrez-votre-serveur-node#/id/r-6466220



# Installation de nodemon

Lignes de commande
Dans backend => cd backend
npm install -g nodemon

Désormais, au lieu d'utiliser node server pour démarrer votre serveur, vous pouvez utiliser nodemon server . Il surveillera les modifications de vos fichiers et redémarrera le serveur lorsqu'il aura besoin d'être mis à jour

# Mise en place de app.js

Express est, pour faire court, un framework reposant sur Node qui facilite la création et la gestion des serveurs Node.

framework Express simplifie les tâches, en nous permettant de déployer nos API beaucoup plus rapidement. Installons-le maintenant.

I/INSTALLATION EXPRESS

1) Lignes de commande:

cd backend
npm install --save express

2) CREER FICHIER app.js avec code pour y placer Express
 
// Import d'express
const express = require('express');

// appel de la méthode express
const app = express();

// export de l'application express pour pouvoir le use dans server.js
module.exports = app;


II/ Exécution EXPRESS (app.js) sur serveur Node (server.js)

Revenir sur server.js et le modifier comme suit:

const http = require('http');

a => const app = require('./app');    => Ajout de cette ligne import de app.js ds server.js

app.set('port', process.env.PORT || 3000);

b => const server = http.createServer(app); => Fonction createServer prend now comme argument app

server.listen(process.env.PORT || 3000);

Avec ce code on aura une erreur "404 PAGE NOTE FOUND CAN NOT GET"
Il faut alors configurer une réponse dans notre application app.js en le modifiant 2) devient

const express = require('express');

const app = express();

code ajouté
app.use((req, res) => 
 {
    res.json({ message: 'Votre requête a bien été reçue !' }); 
 }
);

module.exports = app;

app.use permet de générer une réponse e, json mais on peut customiser davantage nos réponses avec les middlewares


# Ajout de fonctionnalités avec des fonctions ou middleware

Une application Express est fondamentalement une série de fonctions appelées middleware. Chaque élément de middleware reçoit les objets request et response , peut les lire, les analyser et les manipuler, le cas échéant. Le middleware Express reçoit également la méthode next , qui permet à chaque middleware de passer l'exécution au middleware suivant.

Syntaxe d'une fonction avec 3 arguments => req , res , next
next => est appelé apres instruction n pour instruction n+1
Utilisation de la méthode use()

app.use((res , req , next) => {
 instruction 1;
 next();
})

app.use((res , req , next) => {
 instruction 2;
 next();
})

etc...

Exemples:
/* 6) Middlewares exemples pour comprendre le principe

//affichage console
app.use((req , res , next) => {
  console.log("requete bien recue !!!");
  next();
})

//Modif statut requete en 201
app.use((req, res, next ) => {
    res.status(201);
    next();
})

// 4) renvoie d'une réponse au lieu de 404 de "5)" de server.js
//route ou fonction pour all kind of request
//5) ajout du parametre next pour use middlewares
app.use((req , res, next) => {
    res.json({message: 'Votre requete a été reçue'});
    next();
})

// 7) Middleware aprés requete pour signaler la bonne réponse à celle-ci
app.use((req , res) => {
    console.log('Réponse envoyée avec succés')
})*/


Cela va nous servir pour créer des routes GET et gérer les erreurs CORS

# Créer une route GET dans app.js CREATE


I/ Récupérer les items à vendre pour la partie 1+2 du front

Pour réaliser cela il faut créer une route GET qui récupère les 
les items à afficher, via un middleware.

=> MIDDLEWARE Méthode .use() à utiliser avec comme 1er argument le "endpoint" ou encore l'URL visé par l'application
ou encore la route.
Dans la console les items apparaissent bien mais pas dans l'application.

WHY? server => port 3000     Le serveur et l'application ne partagent pas la meme origine => CORS
     app    => port 4200     Soucis entre le navigateur et le serveur


II/ Gestion erreur CORS ou Cross Origin Resource Sharing

Permet d'empêcher des requêtes malveillantes users/servers pour protection des données.
Pour notre API on veut un accés total.

=> MIDDLEWARE Rajout de headers au niveau de nos requêtes (à l'objet res.) avec des spécifications permettant 
navigateur l'acces API

=> Ce middleware est a mettre AU DESSUS du middleware de la route GET

=> Middleware général avec 3 spécifications:

'Access-Control-Allow-Origin'  =>  Toutes les routes '*'
'Access-Control-Allow-Headers' =>  Types de headers
'Access-Control-Allow-Methods' =>  Type de method GET POST etc...

Exemple route GET avec éléments statiques

app.use('/api/stuff', (req, res, next) => {

    const stuff = [
        {
            _id: 'oeihfzeoi',
            title: 'Mon premier objet',
            description: 'Les infos de mon premier objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 4900,
            userId: 'qsomihvqios',
        },

        {
            _id: 'oeihfzeomoihi',
            title: 'Mon deuxième objet',
            description: 'Les infos de mon deuxième objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 2900,
            userId: 'qsomihvqios',
        }
    ];
    res.status(200).json(stuff);

});

# Créer une route POST READ

Exemple simple

//11-Middleware pour POST sur formulaire "ajouter un item"
/*app.post('/api/stuff' , (req , res , next) => {
    console.log(req.body);
    res.status(201).json ({
     message: 'objet créè'
   });
});*/

# Dépendances du projet dans package.json --save et leurs utilisations

"dependencies": {
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.9.25",
    "mongoose-unique-validator": "^2.0.3",
    "multer": "^1.4.2"
}