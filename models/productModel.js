const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    title : String,
    slug : String,
    category : String,
    image : String,
    description : String,
    price : Number,
    images: [String],
    special : Boolean,
    vegan : Boolean


});
const Product = mongoose.model('Product', productSchema);
module.exports = Product ;