const express = require('express');
const wishlistRouter = express.Router();
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

const Wishlist = require('../models/wishlistModel');
const auth = require('../config/auth');


wishlistRouter.get('/', auth.isUser, async (req, res) => {
    let user = req.session.user;
    req.session.user.discount= null;

    let id = user._id;
    let list = await Wishlist.findOne({ userId: id }).populate("wishlist.product");
    let wishcount = null;
    let count =null
    if(user){
        
        const cartItems = await Cart.findOne({userId:user._id});
    
        if(cartItems){
            count = cartItems.cart.length;
        }
    }
    // let t = await Cart.findOne({ userId: id }).populate("cart.product");
    if (user) {

        const wishlistItems = await Wishlist.findOne({ userId: user._id });

        if (wishlistItems) {
            wishcount = wishlistItems.wishlist.length;
        }
    }
    res.render('user/wishlist', { list, user, wishcount ,count});
})


wishlistRouter.get('/add/:product', async (req, res) => {

    let productid = req.params.product;

    let user = req.session.user;
    if(user){

        let id = user._id;
        let wishlist = await Wishlist.findOne({ userId: id });
    
     
        if (!wishlist) {
    
            console.log(' wishlist is null');
    
            let newlist = new Wishlist({
                userId: id,
                wishlist: [{
                    product: productid,
                     }]
            });
            await newlist.save();
            console.log("list created");
            console.log(newlist);
            res.json({status:true,item:'added'});
        } else {
    
            let list = wishlist.wishlist;
    
            // console.log('cart is not null');
    
            let newItem = true;
    
            for (let i = 0; i < list.length; i++) {
    
                if (list[i].product == productid) {
    
                     newItem = false;
    
    
                  
                  
    
                }
            }
            if (newItem) {
                console.log("new item");
    
                await Wishlist.findOneAndUpdate({ userId: id }, { $push: { wishlist: { product: productid} } })
    
    
                console.log("new item pushed");
                res.json({ status: true,item:'added' });

    
            }else{
                await Wishlist.findOneAndUpdate({ userId: id }, { $pull: { wishlist: { product: productid} } })
                res.json({ status: true,item:'removed' });

            }
        }
        // console.log(userCart);
    
    }else{ 
        
        res.json({ status: false });

    }
   

});

wishlistRouter.get('/delete/:product',auth.isUser, async (req, res) => {
    const user = req.session.user;
    const product = req.params.product;
    await Wishlist.findOneAndUpdate({ userId: user._id }, { $pull: { wishlist: { product: product } } });
    res.json({ status: true });

});

module.exports = wishlistRouter;
