const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    coupon : String,
    offer : Number,
    description : String,
    minimum : Number,
    date : String,
    expiry : String

});
const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon ;