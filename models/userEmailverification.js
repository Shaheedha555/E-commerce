const mongoose = require('mongoose');
const verificationSchema = new mongoose.Schema({
    userId : String ,
    uniqueString : String ,
    createdAt : Date ,
    expiresAt : Date 
    
});
const EmailVerification = mongoose.model('EmailVerification', verificationSchema);
module.exports = EmailVerification ;