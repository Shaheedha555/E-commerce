const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
   userId : String,
   details : [{ name : String,
                housename : String,
                street: String,
                landmark : String,
                pin : Number,
                district : String,
                state : String,
                country : String,
                contact : Number    }]

}); 
const Address = mongoose.model('Address', addressSchema);
module.exports = Address ;