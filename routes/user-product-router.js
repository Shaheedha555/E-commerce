const express = require('express');
const userProductRouter = express.Router();
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Wishlist = require('../models/wishlistModel');

const auth = require('../config/auth')

userProductRouter.get('/',async(req,res)=>{
    let products = await Product.find({});
    let categories = await Category.find({});
    let count =null
    const user = req.session.user;
    if(user){
        req.session.user.discount= null;
        
        const cartItems = await Cart.findOne({userId:user._id});
    
        if(cartItems){
            count = cartItems.cart.length;
        }
    }
    let wishcount = null;
   
    // let t = await Cart.findOne({ userId: id }).populate("cart.product");
    if (user) {

        const wishlistItems = await Wishlist.findOne({ userId: user._id });

        if (wishlistItems) {
            wishcount = wishlistItems.wishlist.length;
        }
    }
    res.render('user/products',{products,categories,user,count,wishcount});
});
userProductRouter.get('/:category',async(req,res)=>{
    let category = req.params.category;
    let categories = await Category.find({});
    let products = await Product.find({category:category});
    let count =null
    const user = req.session.user;
    if(user){
        
        const cartItems = await Cart.findOne({userId:user._id});
    
        if(cartItems){
            count = cartItems.cart.length;
        }
    }
    let wishcount = null;
   
    // let t = await Cart.findOne({ userId: id }).populate("cart.product");
    if (user) {

        const wishlistItems = await Wishlist.findOne({ userId: user._id });

        if (wishlistItems) {
            wishcount = wishlistItems.wishlist.length;
        }
    }
    console.log(products.length);
    res.render('user/products',{products,categories,user,count,wishcount});
});


userProductRouter.get('/product-details/:id',async(req,res)=>{
    let id = req.params.id;
    let product = await Product.findById(id);
    let images = product.images;
    const user = req.session.user;
    let count =null
    if(user){
        
        const cartItems = await Cart.findOne({userId:user._id});
    
        if(cartItems){
            count = cartItems.cart.length;
        }
    }
    let wishcount = null;
   
    // let t = await Cart.findOne({ userId: id }).populate("cart.product");
    if (user) {

        const wishlistItems = await Wishlist.findOne({ userId: user._id });

        if (wishlistItems) {
            wishcount = wishlistItems.wishlist.length;
        }
    }
    res.render('user/single-product',{product,images,user,count,wishcount});
})








module.exports = userProductRouter