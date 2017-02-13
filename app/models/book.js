var mongoose = require("mongoose");

// Define the book model
var bookSchema = mongoose.Schema({
    title : String,
    author  : String,
    owner : String,
    cover : String,
    available : Boolean
});

// create the model for book and expose to the app
module.exports = mongoose.model('Book', bookSchema);