const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    contact : Number,
    password : String,
    cpassword : String,
    verified : Boolean,
    image : String,
    status : Boolean

});
const User = mongoose.model('User', userSchema);
module.exports = User ;