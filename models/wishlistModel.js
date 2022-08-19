const mongoose = require('mongoose');
const wishlistSchema = new mongoose.Schema({
  userId : {type : mongoose.Schema.Types.ObjectId,
            ref : 'User'},
  wishlist : [{
    product:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    }}]
});
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;