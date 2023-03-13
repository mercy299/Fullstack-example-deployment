# Mise en place de server.js

This is the Node server.

Node is the runtime that allows us to write all of our server-side tasks in JavaScript, such as business logic, data persistence and security. Node also adds features that the standard browser JavaScript does not have, such as access to the local file system


PROJECT INITIALIZATION OR SERVER NODE STARTUP

This process generates a blank package.json file, in which the details of all the npm packages we will use for this project will be stored

=> In the "backend" folder npm init
=> enter 'till entry point and name it "server.js" (create then)
=> ds "backend" git init then create a ".gitignore" file
=> create a server.js file in "backend
Code to put in server.js

a => const http = require('http');

b => const server = http.createServer(
    c => (req, res) => 
    {
     d => res.end('Here is the server response!');
    }
);

e => server.listen(process.env.PORT || 3000);

a)Here you import the native HTTP package from Node. 

b)You use it to create a server, passing a function that will be executed on each call to this server. 

c) This function receives the request and response objects as arguments. 

d)In this example, you use the end method of the response to return a string response to the caller.

e) In the last line, you configure the server to listen for :

1) either the environment variable of the port thanks to process.env.PORT : if the deployment platform proposes a default port, we will listen to it;

2) or the port 3000, which will be used in the case of our development platform.

https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb/6466231-demarrez-votre-serveur-node#/id/r-6466220



# Installing nodemon
Command lines
In backend => cd backend
npm install -g nodemon

Now, instead of using node server to start your server, you can use nodemon server. It will monitor your files for changes and restart the server when it needs to be updated

# Setting up app.js

Express is, in short, a Node-based framework that makes it easy to create and manage Node servers.

framework Express simplifies tasks, allowing us to deploy our APIs much faster. Let's install it now.

I/EXPRESS INSTALLATION

1) Command lines:

cd backend
npm install --save express

2) CREATE FILE app.js with code to put Express
 
// Import express
const express = require('express');

// call the express method
const app = express();

// export the express application to use it in server.js
module.exports = app;


II/ Running EXPRESS (app.js) on Node server (server.js)

Go back to server.js and modify it as follows:

const http = require('http');

a => const app = require('./app'); => Add this line import from app.js ds server.js

app.set('port', process.env.PORT || 3000);

b => const server = http.createServer(app); => Function createServer takes now as argument app

server.listen(process.env.PORT || 3000);

With this code we will get an error "404 PAGE NOTE FOUND CAN NOT GET".
Then we need to configure a response in our app.js application by modifying it 2) becomes

const express = require('express');

const app = express();

added code
app.use((req, res) => 
 {
    res.json({ message: 'Your request has been received!' }); 
 }
);

module.exports = app;

app.use allows to generate an e, json response but we can customize more our responses with the middlewares


# Adding functionality with functions or middleware

An Express application is basically a series of functions called middleware. Each middleware element receives the request and response objects, can read them, parse them and manipulate them, if necessary. The Express middleware also receives the next method , which allows each middleware to pass execution to the next middleware.

Syntax of a function with 3 arguments => req , res , next
next => is called after instruction n for instruction n+1
Use of the use() method

app.use((res , req , next) => {
 instruction 1;
 next();
})

app.use((res , req , next) => {
 instruction 2;
 next();
})

etc...

Examples:
/* 6) Middlewares examples to understand the principle

//console display
app.use((req , res , next) => {
  console.log("request well received!!!");
  next();
})

//Modify status of request in 201
app.use((req, res, next ) => {
    res.status(201);
    next();
})

// 4) returns a response instead of 404 from "5)" of server.js
//route or function for all kind of request
//5) added next parameter to use middlewares
app.use((req , res, next) => {
    res.json({message: 'Your request has been received'});
    next();
})

// 7) Middleware after request to report the correct answer to it
app.use((req , res) => {
    console.log('Response sent successfully')
})*/


This will be used to create GET routes and handle CORS errors

# Create a GET route in app.js CREATE

I/ Retrieve the items to be sold for the 1+2 part of the front-end

To do this, we need to create a GET route that retrieves the 
the items to display, via a middleware.

=> MIDDLEWARE .use() method to be used with as 1st argument the "endpoint" or the URL targeted by the application
or the route.
In the console the items appear but not in the application.

WHY? server => port 3000 The server and the application do not share the same origin => CORS
     app => port 4200 Problems between the browser and the server


II/ CORS or Cross Origin Resource Sharing error management

Allows to prevent malicious user/server requests for data protection.
For our API we want a total access.

=> MIDDLEWARE Adding headers to our requests (to the res. object) with specifications allowing 
browser the API access

=> This middleware is to be put ABOVE the middleware of the GET route

=> General middleware with 3 specifications:

'Access-Control-Allow-Origin' => All routes '*' => 'Access-Control-Allow-Origin' => All routes '*' => 'Access-Control-Allow-Origin
Access-Control-Allow-Headers' => Header types
Access-Control-Allow-Methods' => Type of method GET POST etc...

Example GET route with static elements

app.use('/api/stuff', (req, res, next) => {
    const stuff = [
        {
            _id: 'oeihfzeoi',
            title: 'My first object',
            description: 'The info of my first object',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 4900,
            userId: 'qsomihvqios',
        },

        {
            _id: 'oeihfzeomoihi',
            title: 'My second item',
            description: 'The info of my second object',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 2900,
            userId: 'qsomihvqios',
        }
    ];
    res.status(200).json(stuff);

});

# Create a POST READ route

Simple example

//11-Middleware for POST on "add an item" form
/*app.post('/api/stuff' , (req , res , next) => {
    console.log(req.body);
    res.status(201).json ({
     message: 'object created
   });
});*/

# Project dependencies in package.json --save and their uses

"dependencies": {
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.9.25",
    "mongoose-unique-validator": "^2.0.3",
    "multer": "^1.4.2"
}