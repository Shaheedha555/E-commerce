const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
          },
  cart : [{
    product : 
    {type :mongoose.Schema.Types.ObjectId,
    ref : 'Product'},
    quantity : {
      type:Number,
      default:1},
    weight: {
      type : Number,
      default : 1},
    price  : Number,
    sub_total: Number
  }]
});
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;