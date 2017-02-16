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
            response.sendFile(process.cwd() + '/public/profile.html');
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
             // change firstLogin var status
             if (request.user.local.firstLogin) {
                 passport.updateLoginVar(request.user);
             }
             console.log(request.user.local.requestsOutArray);
        });
    
    // Update profile settings
    app.route('/updateProfile')
        .post(function(request, response) {
            // handle password or user's info request
            // save user's info
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
                        response.json('Settings updated.');
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
        .get(isLoggedIn, function(request, response) {
            response.sendFile(process.cwd() + '/public/details.html');
        });
        
    app.route('/trade')
        .post(function(request, response) {
            // update counts of request maker
            User.findOne({'local.email' : request.user.local.email}, function(error, user) {
                if (error) throw error;
                user.local.requestsOut += 1;
                var bookArr = [];
                bookArr.push(request.body.title, request.body.owner);
                user.local.requestsOutArray.push(bookArr);
                console.log(user.local.requestsOutArray);
                user.save(function(error) {
                    if (error) throw error;
                    console.log('Count updated requester');
                });
            });
            
            // update counts of book owner
            User.findOne({'local.email' : request.body.owner}, function(error, user) {
                if (error) throw error;
                user.local.requestsIn += 1;
                var bookArr = [];
                bookArr.push(request.body.title, request.user.local.email, request.body.ID);
                user.local.requestsInArray.push(bookArr);
                console.log(user.local.requestsInArray);
                user.save(function(error)  {
                    if (error) throw error;
                    console.log('Count updated owner');
                });
            });
            // update book info and set to unavailable
            manageBooks.setAvailableStatus(request, response, request.body.ID);
        });
        
    app.route('/tradeStatus')
        .post(function(request, response) {
            console.log('tradeStatus');
            User.findOne({'local.email' : request.user.local.email}, function(error, user) {
                console.log('owner');
                if (error) throw error;
                user.local.requestsIn -= 1;
                // remove book from incoming requests array
                for (var i = 0; i < user.local.requestsInArray.length; i++) {
                    if (user.local.requestsInArray[i][0] === request.body.title) {
                        user.local.requestsInArray.splice(i, 1);
                    }
                }
                user.save(function(error)  {
                    if (error) throw error;
                    console.log('Owner Updated ' + user.local.email);
                });
            });
            
            // requester
            User.findOne({'local.email' : request.body.requester}, function(error, user) {
                if (error) throw error;
                user.local.requestsOut -= 1;
                // remove book from outgoing requests array
                for (var i = 0; i < user.local.requestsOutArray.length; i++) {
                    if (user.local.requestsOutArray[i][0] === request.body.title) {
                        user.local.requestsOutArray[i].set(2, request.body.status);
                        user.markModified('requestsOutArray');
                        user.save(function(error)  {
                            if (error) throw error;
                            console.log('Requester Updated ' + JSON.stringify(user));
                        });
                    }
                }
                user.save(function(error)  {
                    if (error) throw error;
                    console.log('Requester Updated ' + user.local.requestsOutArray);
                });
                
            });
            
            if (request.body.status === 'Rejected') {
                //manageBooks.tradeRejected(request, response, request.body.ID);
            }
            
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
