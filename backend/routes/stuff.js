//Création d'un routeur via Express
const express = require('express');

//Méthode Express => Router()
const router = express.Router();

//Import du controller ici
const stuffCtrl = require('../controllers/stuff');



//import du middleware d'authentification pour protéger nos routes
const auth = require('../middleware/auth');

//import du middleware multer pour le téléchargement d'images => Gestion fichiers add/supp par user
const multer = require('../middleware/multer');



//LES ROUTES réécrite avec la logique métier transférée vers le controller

//Route post pour créer un stuff par un user et ajout de fichier avec multer
router.post('/' , auth, multer, stuffCtrl.createThing);

// Route put pour modifier un objet existant UPDATE
router.put('/:id' , auth, multer, stuffCtrl.modifyThing);

// Route delete pour suppression d'un Thing
router.delete('/:id' , auth, stuffCtrl.deleteThing );

//Route get pour prendre un objet avec id precis affichage dynamique
router.get('/:id', auth, stuffCtrl.getOneThing);

//8-Middleware de l'app avec objets à l'adresse http://localhost:3000/api/stuff ayant pour extension '/api/stuff'
//Premiere route GET avant usage de Thing model mongoose
router.get('/', auth, stuffCtrl.getAllThings);


//export vers router.js (et autres fichiers si besoin)
module.exports = router;


/*
cela facilite la compréhension de notre fichier de routeur.

Il est évident quelles routes sont disponibles à quels points de terminaison, 

et les noms descriptifs donnés aux fonctions de notre contrôleur permettent de 

mieux comprendre la fonction de chaque route.
*/

/*
MULTER => MODIFICATION DES ROUTES POST ET PUT

*/