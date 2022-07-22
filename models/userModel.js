const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name : {
        type : String ,
    },
    email : {
        type : String ,
    },
    contact : {
        type : Number 
    },
    password : {
        type : String 
    },
    cpassword : {
        type : String
    },
    verified : {
        type : Boolean
    }
});
const User = mongoose.model('User', userSchema);
module.exports = User ;