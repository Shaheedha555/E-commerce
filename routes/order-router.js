const express = require('express');
const orderRouter = express.Router();
// const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Wishlist = require('../models/wishlistModel');
const Cart = require('../models/cartModel');

const auth = require('../config/auth');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel');


orderRouter.get('/',auth.isUser,async (req,res)=>{
    let user = req.session.user;
    let count = null;
    if (user) {
        
        const cartItems = await Cart.findOne({ userId: user._id });

        if (cartItems) {
            count = cartItems.cart.length;
        }
    }
    let wishcount = null;
   
    if (user) {

        const wishlistItems = await Wishlist.findOne({ userId: user._id });

        if (wishlistItems) {
            wishcount = wishlistItems.wishlist.length;
        }
    }
    Order.findOne({userId:user._id}).populate([
        {path:'orders.orderDetails',
            populate : {
                path : 'product',
                model : 'Product'
            }
        }]).then((order)=>{

       

        res.render('user/order-details',{user,count,wishcount,order});
        
    });

});

orderRouter.get('/order-details/:index',auth.isUser,async (req,res)=>{
    let user = req.session.user;
    let index= req.params.index;

    let count = null;
    if (user) {
        
        const cartItems = await Cart.findOne({ userId: user._id });

        if (cartItems) {
            count = cartItems.cart.length;
        }
    }
    let wishcount = null;
   
    if (user) {

        const wishlistItems = await Wishlist.findOne({ userId: user._id });

        if (wishlistItems) {
            wishcount = wishlistItems.wishlist.length;
        }
    }
    let orders = await Order.findOne({userId:user._id}).populate([

                        {path:'orders.orderDetails',
                            populate : {
                               
                                    path : 'product',
                                    model : 'Product'
            
                            }
                        }

                    ]).then((order)=>{
                        
                        orderData = order.orders[index];
                        console.log('ghjk' + orderData)
                        res.render('user/order-single-details',{user,count,wishcount,orderData,index});
                        
                    });

});

orderRouter.get('/order-cancel/:index',async(req,res)=>{
    let user = req.session.user;
    let index= req.params.index;
    Order.findOne({userId:user._id}).then((item)=>{
        item.orders[index].status = 'cancelled';
        item.save();
        console.log(item + 'updated');
        res.json({status:true});
    })
  
})



module.exports = orderRouter;