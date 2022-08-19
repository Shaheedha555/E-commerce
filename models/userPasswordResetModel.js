const mongoose = require('mongoose');
const passwordResetSchema = new mongoose.Schema({
    userId : String ,
    otp : String ,
    createdAt : Date ,
    expiresAt : Date 
    
});
const Otp = mongoose.model('Otp', passwordResetSchema);
module.exports = Otp ;