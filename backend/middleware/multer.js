const multer = require('multer');

//dico pour les mimes des fichiers pour gérer ensuite les extensions
const MIME_TYPES = {
    'image/jpg ': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    //destination de stockage de l'image
    destination: ( req, file, callback ) => {
        callback(null, 'image')
    },
    //nom du fichier image
    filename: ( req, file, callback ) => {
        const name = file.originalname.split(' ').join('_');  //traitement du nom du fichier en enlevant les espaces et en les joignant par _
        //config.extension fichier
        const extensionFichier = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extensionFichier);
    }
});

module.exports = multer({ storage }).single('image');


/*

Dans ce middleware multer:

=> nous créons une constante storage , à passer à multer comme configuration, 

qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants :

a) la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images ;

b) la fonction filename indique à multer d'utiliser le nom d'origine, 

de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. 

Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée ;


=> nous exportons ensuite l'élément multer entièrement configuré, 

lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.

Avant de pouvoir appliquer notre middleware à nos routes stuff , 

nous devrons les modifier quelque peu, car la structure des données entrantes n'est pas tout à fait 

la même avec des fichiers et des données JSON.


*/