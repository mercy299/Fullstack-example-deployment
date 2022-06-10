//Utilisation du modéle Thing ici
const Thing = require('../models/Thing');

//package fs file system => modif + supp de fichiers
const fs = require('fs');


//Création de fonctions reprenant la logique métier du CRUD

exports.createThing = (req , res , next) => {
    const thingObject = JSON.parse(req.body.thing); //Format requete changée req.body.thing est now un string à convertir en JSON exploitable
    delete thingObject._id;
    const thing = new Thing({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}` // chaine dynamique URL :le frontend ne sait pas l'URL donné par multer de l'image il faut lui indiquer
    });
    thing.save()
     .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
     .catch(error => res.status(400).json({ error }));
    
};


exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
};


exports.getAllThings = (req, res, next) => {
    Thing.find()
     .then(things => res.status(200).json(things))
     .catch(error => res.status(400).json({ error }));
   
};


exports.modifyThing = (req , res ,next) => {
    const thingObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    } : { ...req.body};
    Thing.updateOne({ _id: req.params.id } , { ...thingObject, _id: req.params.id })
     .then(() => res.status(200).json({ message: 'Objet modifié'}))
     .catch(error => res.status(400).json({ error }));
};


exports.deleteThing = (req , res , next) => {
    Thing.findOne({ _id: req.params.id })
    .then(thing => {
        const filename = thing.imageUrl.split('/image/')[1];
        fs.unlink(`image/${filename}` , () => {
        Thing.deleteOne({ _id: req.params.id})
         .then(() => res.status(200).json({ message : 'Objet supprimé'}))
         .catch(error => res.status(400).json({ error }));
            
        });
    })
    .catch(error => res.satus(500).json({ error }));
};


/*

Multer => MODIFICATION DE LA ROUTE POST fonction createThing() l8

=> Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data,

et non sous forme de JSON. 

Le corps de la requête contient une chaîne thing , qui est simplement un objet Thing converti en chaîne. 

Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.

=> Nous devons également résoudre l'URL complète de notre image, 

car req.file.filename ne contient que le segment filename . 

Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http' ). 

Nous ajoutons '://' , puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ). 

Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.



En fait, nous effectuons une demande GET vers http://localhost:3000/images/<image-name>.jpg.

Cela semble simple, mais n'oubliez pas que notre application s'exécute sur localhost:3000 

et nous ne lui avons pas indiqué comment répondre aux requêtes transmises à cette route : elle renvoie donc une erreur 404.

Pour remédier à cela, nous devons indiquer à notre app.js comment traiter les requêtes vers la route /image ,

en rendant notre dossier images statique.

Il nous faudra une nouvelle importation dans app.js pour accéder au path de notre serveur:

const path = require('path');

De plus, nous ajoutons le gestionnaire de routage suivant juste au-dessus de nos routes actuelles :

app.use('/images', express.static(path.join(__dirname, 'images')));

Cela indique à Express qu'il faut gérer la ressource images de manière statique 

(un sous-répertoire de notre répertoire de base, __dirname ) à chaque fois qu'elle reçoit 

une requête vers la route /images .

Enregistrez et actualisez l'application dans le navigateur ; désormais, tout devrait fonctionner correctement

*/


/*

MULTER => MODIFICATION DE LA ROUTE PUT + ACTUALISATION CTLER modifyThing() l34

prendre en compte deux possibilités : l'utilisateur a mis à jour l'image, ou pas. 

Dans le premier cas, nous recevrons l'élément form-data et le fichier. 

Dans le second cas, nous recevrons uniquement les données JSON

Ajouter le middleware multer à la route PUT.

Modifier la fonction modifyThing() de la maniere suivante:

Ligne 35 => opérateur ternaire ? + création d'une new constante thingObject

Dans cette version modifiée de la fonction, on crée un objet thingObject qui regarde si req.file existe ou non. 

S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. 

On crée ensuite une instance Thing à partir de thingObject , puis on effectue la modification.

Ligne 40 => Actualisation de la constante avec updateOne 2eme argument


*/


/*

MODIFICATION FONCTION DELETE

En ce qui concerne la gestion des fichiers dans notre back-end, il faut absolument nous assurer que, 

à chaque suppression d'un Thing de la base de données, le fichier image correspondant est également supprimé.

Dans notre contrôleur stuff , il nous faut une nouvelle importation. Il s'agit du package fs de Node : const fs = require('fs');


Dans cette fonction :

=> nous utilisons l'ID que nous recevons comme paramètre pour accéder au Thing correspondant dans la base de données ;

=> nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;

=> nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;

=> dans le callback, nous implémentons la logique d'origine, en supprimant le Thing de la base de données.

Notre API peut désormais gérer correctement toutes les opérations CRUD contenant des fichiers : 

lorsqu'un utilisateur crée un Thing , met à jour un Thing existant ou supprime un Thing !

*/