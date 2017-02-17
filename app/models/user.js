var mongoose = require("mongoose"),
    bcrypt = require("bcrypt-nodejs");
    
// Define the schema for our user model

var userSchema = mongoose.Schema({
    local : {
        email : String,
        password : String,
        username : String,
        city : String,
        state : String,
        firstLogin : Boolean,
        requestsIn : Number,
        requestsOut : Number,
        requestsInArray: Array,
        requestsOutArray: Array
    }
});

// Generate a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);  
};

// check if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);  
};

// userSchema.methods.comparePassword = function(user, oldPass, newPass) {
//         bcrypt.hash(oldPass, null, null, function(error, hash) {
//             if (error) throw error;
//             // store hash in passwords DB
//         });
//         // load hash from passwords DB
//         bcrypt.compare('')
//     };




// create the model for user and expose to the app
module.exports = mongoose.model('User', userSchema);