const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
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
    
});
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin ;

// NCLK2A8m7DBnwOg5