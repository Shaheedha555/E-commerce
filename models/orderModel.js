const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({

    userId : {type:mongoose.Schema.Types.ObjectId,
            ref : 'User'},
    // orders :[{
        orderDetails : [Object],
        address : Object,
        total : Number,
        shipping: Number,
        discount: Number,
        date : String,
        status : String,
        deliveryDate : String
    // }]
}); 
const Order = mongoose.model('Order', orderSchema);
module.exports = Order ;