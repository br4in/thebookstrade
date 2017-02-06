var express = require("express"),
    app = express(),
    port = process.env.PORT || 8080,
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    bodyParser = require("body-parser"),
    session = require("express-session"),
    path = require("path");
    
var configDB = require("./config/database.js");

mongoose.connect(configDB.url);

require('./config/passport')(passport); // pass passport for configuration

app.use(bodyParser()); // get information from html forms
app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/public/css')));
// required for passport
app.use(session({ secret: 'mysecretpass' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);