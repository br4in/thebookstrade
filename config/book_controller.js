var Book = require("../app/models/book.js"),
    books = require('google-books-search');

function manageBooks() {
    
    // Search book on google books
    this.searchBook = function(request, response, title) {
        // -->prevent duplicate from same user<-- to-do
        books.search(title, function(error, results) {
            console.log(JSON.stringify(results[0].thumbnail));
            if (error) throw error;
            var newBook = new Book();
            newBook.title = results[0].title;
            newBook.author = results[0].authors;
            newBook.owner = request.user.local.email;
            newBook.cover = results[0].thumbnail;
            newBook.save(function(error) {
                if (error) throw error;
                response.redirect('/profile');
            });
        });
    };
    
    // Get all the books in the db
    this.getAllBooks = function(request, response) {
        Book.find(function(error, books) {
            if (error) throw error;
            response.json(books);
        });
    };
    // Get all the books owned by a user
    this.getOwnedBooks = function(request, response, email) {
        Book.find({owner : email}, function(error, books) {
            if (error) throw error;
            response.json(books);
        });
    };
    
    this.removeBook = function(request, response) {
        /*
        Book.findById(id, function(error, book) {
            if (error) throw error;
            if (book) {
                book.remove(function(error) {
                    if (error) throw error;
                    response.json(book);
                });
            } else {
                console.log('Book not found');
            }
        });
        */
    };
}

module.exports = manageBooks;