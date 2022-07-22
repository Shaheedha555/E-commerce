const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    
    image : {
        type : String ,
    },
    title : {
        type : String 
    }
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category ;