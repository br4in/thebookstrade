var Book = require("../app/models/book.js"),
    books = require('google-books-search');

function manageBooks() {
    
    // Search book on google books
    this.searchBook = function(request, response, title) {
        // -->prevent duplicate from same user<-- to-do
        books.search(title, function(error, results) {
            if (error) throw error;
            var newBook = new Book();
            newBook.title = results[0].title;
            newBook.author = results[0].authors;
            newBook.owner = request.user.local.email;
            newBook.cover = results[0].thumbnail;
            newBook.available = true;
            newBook.save(function(error) {
                if (error) throw error;
                console.log(newBook);
                response.redirect('/profile');
            });
        });
    };
    
    // Get all the books in the db
    this.getAllBooks = function(request, response) {
        Book.find({available : true}, function(error, books) {
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
    
    this.removeBook = function(request, response, id) {
        Book.findById(id, function(error, book) {
            if (error) throw error;
            if (book) {
                book.remove(function(error) {
                    if (error) throw error;
                    response.json('Book removed');
                });
            }
        });
    };
    
    this.displayBook = function(request, response, id) {
        Book.findById(id, function(error, book) {
            if (error) throw error;
            if (book) {
                response.json(book);
            }
        });
    };
    
    this.setStatus = function(request, response, id) {
        Book.findById(id, function(error, book) {
            if (error) throw error;
            if (book) {
                if (book.available === true) {
                    book.available = false;
                } else {
                    book.available = true;
                }
                book.save(function(error) {
                    if (error) throw error;
                    console.log('Book status updated');
                });
            }
        });
    };
}

module.exports = manageBooks;