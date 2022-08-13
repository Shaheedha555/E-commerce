const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
   userId : {type:mongoose.Schema.Types.ObjectId,
             ref : 'User'},
   details : [{ name : String,
                housename : String,
                street: String,
                landmark : String,
                pin : Number,
                district : String,
                state : {type:String,default:"Kerala"},
                country : {type:String,default:"India"},
                contact : Number ,
                select : {type:Boolean,default:false}   }]

}); 
const Address = mongoose.model('Address', addressSchema);
module.exports = Address ;