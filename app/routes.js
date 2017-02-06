var User = require("../app/models/user.js");
var manageBooksModule = require("../config/book_controller.js");

module.exports = function(app, passport) {
    
    var manageBooks = new manageBooksModule();
    
    // Index
    app.route('/')
        .get(function(request, response) {
            response.sendFile(process.cwd() + '/public/index.html');
        });
        
    // Home
    app.route('/home')
        .get(isLoggedIn, function(request, response) {
            response.sendFile(process.cwd() + '/public/home.html');
        });
        
    // Login
    app.route('/login')
        .post(passport.authenticate('local-login', {
            successRedirect: '/profile',
            failureRedirect: '/',
            failureFlash: true
        }));
    
    // Signup
    app.route('/signup')
        .post(passport.authenticate('local-signup', {
            successRedirect: '/profile',
            failureRedirect: '/',
            failureFlash: true // allow flash messages
        }));
        
    // Profile section
    // we will want this protected so you have to be logged in to visit
    app.route('/profile')
        .get(isLoggedIn, function(request, response) {
            //response.sendFile(process.cwd() + '/public/profile.html', { user : request.user });
            var options = {
                user : request.user
            };
            response.sendFile(process.cwd() + '/public/profile.html', options);
        });
    
    // Logout 
    app.route('/logout')
        .get(function(request, response) {
            request.logout();
            response.redirect('/');
        });
    
    // get user's data
    app.route('/data')
        .get(isLoggedIn, function(request, response) {
             var data = {
                 user : request.user
             };
             response.json(data);
        });
    
    // Update profile settings
    app.route('/updateProfile')
        .post(function(request, response) {
            var username = request.body.username,
                city = request.body.city,
                state = request.body.state,
                id = request.body.id;
            User.findById(id, function(error, doc) {
                if (error) throw error;
                if (doc) {
                    doc.local.city = city;
                    doc.local.state = state;
                    doc.local.username = username;
                    // Save
                    doc.save(function(error) {
                        if (error) throw error;
                        console.log('Settings updated.');
                    });
                }
            });
        });
    
    // Get new book
    app.route('/newBook')
        .post(function(request, response) {
            manageBooks.searchBook(request, response, request.body.bookTitle);
        });
      
    // Get all books owned by a user
    app.route('/ownedBooks')
        .get(function(request, response) {
             manageBooks.getOwnedBooks(request, response, request.user.local.email);
        });
        
    // Get all books in db
    app.route('/getAll')
        .get(function(request, response) {
            manageBooks.getAllBooks(request, response); 
        });
        
    app.route('/removeBook/:id')
        .get(function(request, response) {
            manageBooks.removeBook(request, response, request.params.id);
        });
        
    app.route('/bookDetails/:id')
        .get(function(request, response) {
            manageBooks.displayBook(request, response, request.params.id);
        });
    
    app.route('/details/:id')
        .get(function(request, response) {
            response.sendFile(process.cwd() + '/public/details.html');
        });
      
    // Make sure the user is logged in 
    function isLoggedIn(request, response, next) {
        if (request.isAuthenticated()) {
            return next();
        } else {
            response.redirect('/');
        }
    }
};
