const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    coupon : String,
    offer : Number,
    date : String,
    expiry : Number

});
const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon ;