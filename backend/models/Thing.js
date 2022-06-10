//Nécessité de mongoose pour créer nos schémas de données ou things
const mongoose = require('mongoose');

//Création schéma de données => Pas besoin d'ajouter _id car donner automatiquement par mongoose
const thingSchema = mongoose.Schema({
    title: { type: String, required:true },
    description: { type: String, required:true },
    imageUrl: { type: String, required:true },
    userId: { type: String, required:true },
    price: { type: Number, required:true },
});

//Pour pouvoir use ce schéma comme model (CRUD dessus ds la bd), il va falloir l'exporter
module.exports = mongoose.model('Thing' , thingSchema);
