module.exports = function(app, passport) {
    // Home
    app.route('/')
        .get(function(request, response) {
            response.sendFile(process.cwd() + '/public/index.html');
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
    // we will use route middleware to verify this (the isLoggedIn function)
    app.route('/profile')
        .get(isLoggedIn, function(request, response) {
            //response.sendFile(process.cwd() + '/public/profile.html', { user : request.user });
            var data = {
                user : request.user
            };
            console.log(request.user.local['email']);
            response.sendFile(process.cwd() + '/public/profile.html', { user : request.user });
        });
    
    // Logout 
    app.route('/logout')
        .get(function(request, response) {
            request.logout();
            response.redirect('/');
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
