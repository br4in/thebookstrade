var LocalStrategy = require("passport-local").Strategy,
    User = require("../app/models/user.js");
    
module.exports = function(passport) {
    // Session setup
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    // Signup
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(request, email, password, done) {
        process.nextTick(function() {
            User.findOne({ 'local.email' : email }, function(error, user) {
                if (error) return done(error);
                if (user) {
                    return done(null, false, request.flash('signupMessage', 'Email already taken'));
                } else {
                    // Create the user
                    var newUser = new User();
                    // Set credentials
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    // Save it
                    newUser.save(function(error) {
                        if (error) throw error;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
    
    // Login
    passport.use('local-login', new LocalStrategy( {
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(request, email, password, done) {
        User.findOne({ 'local.email' : email }, function(error, user) {
            if (error) return done(error);
            if (!user) {
                return done(null, false, request.flash('loginMessage', 'User not found.'));
            }
            if (!user.validPassword(password)) {
                return done(null, false, request.flash('loginMessage', 'Wrong password.'));
            }
            return done(null, user);
        });
    }));
};