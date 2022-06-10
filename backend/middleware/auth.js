const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //recupérer le token en splittant l'espace
        const token = req.headers.authorization.split(' ')[1];
        //Décodage du TOKEN récupéré si tout est ok
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //extraction du userId car verify a transformé notre token en objet
        const userId = decodedToken.userId;
        //on check si existance de userId et on compare ce userId de la requete
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User Id non valable !';
        } else {
            //arrivé ici tout est ok on passe au next middleware
            next();
        }
    } catch ( error ) {
        res.status(401).json({ error: error | 'Requête non authentifiée !!!'})
        
    }
};


/*
MIDDLEWARE AUTH:

=> étant donné que de nombreux problèmes peuvent se produire, nous insérons tout à l'intérieur d'un bloc try...catch ;

=> nous extrayons le token du header Authorization de la requête entrante. 

N'oubliez pas qu'il contiendra également le mot-clé Bearer . 

Nous utilisons donc la fonction split pour récupérer tout après l'espace dans le header. 

Les erreurs générées ici s'afficheront dans le bloc catch ;

=> Nous utilisons ensuite la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée ;

=> nous extrayons l'ID utilisateur de notre token ;

=> si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. 

S'ils sont différents, nous générons une erreur ;

=> dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. 

Nous passons l'exécution à l'aide de la fonction next() .

=> Maintenant, nous devons appliquer ce middleware à nos routes stuff , qui sont celles à protéger. 

Dans notre routeur stuff , nous importons notre middleware et le passons comme argument aux routes à 


=> split(' ') => split autour de l'espace rend un tableau avec bearer comme 1er élément

=> 'RANDOM_TOKEN_SECRET' => Clé générique pour l'exemple mais en production elle sera plus longue, complexe et

aléatoire.
*/