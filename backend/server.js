// 1) Accés objet http (fournit par Node) permettant de créer le serveur
const http = require('http'); 

// 4) import d'express venant de app.js ds le MEME dossier
const app = require('./app')

// 2) Fonction recevant 2 arguments (request et response) => Test avant install express
/*const server = http.createServer((req , res) =>{

    //Methode end sur res pour envoie reponse de type end
    res.end('Voila la nouvelle reponse de serveur walabok nakamou?')
});*/

// 7) Amélioration du code server.js

/*7-1 la fonction normalizePort renvoie un port valide, 
qu'il soit fourni sous la forme d'un numéro ou d'une chaîne ;*/ 

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }
    return false;
}
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/*7-2 la fonction errorHandler  recherche les différentes erreurs et les gère de manière 
appropriée. Elle est ensuite enregistrée dans le serveur ; */

const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges.');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use.');
          process.exit(1);
          break;
      default:
        throw error;
    }
};


// 6) initialisation des ports pour l'app
//app.set('port' , process.env.PORT || 3000)

// 5) meme principe qu'en 2 sauf que l'argument de la fonction est app
const server = http.createServer(app);

/*7-3 un écouteur d'évènements est également enregistré,
consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.*/

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);

// 3) attente des requests listen des requetes
//server.listen(process.env.PORT || 3000);

