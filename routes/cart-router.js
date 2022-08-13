const express = require('express');
const cartRouter = express.Router();
// const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Wishlist = require('../models/wishlistModel');
const Cart = require('../models/cartModel');

const auth = require('../config/auth');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel');
const Razorpay = require('razorpay');
const instance = new Razorpay({
    key_id: 'rzp_test_M7kqvBj4orNzLd',
    key_secret: 'tbZOzwOin4RoIHaszi12ZhN3',
  });

cartRouter.get('/', auth.isUser, async (req, res) => {
    let user = req.session.user;
    let id = user._id;
    let carts = await Cart.findOne({ userId: id }).populate("cart.product");
    let count = null;
    let sum = null;
    if(carts){

        let cart = carts.cart;
         sum = cart.reduce((sum,x)=>{
            return sum+x.sub_total;
        },0);
        req.session.total = sum;
        console.log(sum);
    }
    let shipping;
    if(sum>2500){
        shipping = 0;
    }else{
        shipping = 100;
    }
    // let t = await Cart.findOne({ userId: id }).populate("cart.product");
    if (user) {

        const cartItems = await Cart.findOne({ userId: user._id });

        if (cartItems) {
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
    res.render('user/cart', { carts, user, count , sum ,shipping,wishcount});
})

cartRouter.get('/add/:product', auth.isUser, async (req, res) => {
    // console.log("api call");
    let productid = req.params.product;
    console.log(productid);
    let user = req.session.user;
    let product = await Product.findById((productid));
    let price = product.price;
    let id = user._id;
    // console.log(id + user.name);
    let userCart = await Cart.findOne({ userId: id });

    // console.log(userCart + " userCart");
 
    if (!userCart) {

        // console.log(' cart is null');

        let newcart = new Cart({
            userId: id,
            cart: [{
                product: productid,
                quantity: 1,
                price : price,
                sub_total : price
            }]
        })
        await newcart.save();
        // console.log("cart created");
        // console.log(newcart);
    } else {

        // let cart = userCart.cart;

        // console.log('cart is not null');

        // let newItem = true;
        // let pro = await Cart.findOneAndUpdate({userId : id, 'cart.product':productid},{$inc:{'cart.quantity': 1}});

        // console.log(pro +" weight 1");
        // for (let i = 0; i < cart.length; i++) {

        //     if (cart[i].product == productid) {

        //         // let pro = await Cart.findOne({userId : id, 'cart[i].product':productid, "cart[i].weight":1}).projection({'cart[i].weight':1});
        //         // await Cart.findOneAndUpdate({ userId: id, "cart[i].product": productid ,'cart[i].weight':1},
        //         //     { $inc: { "cart[i].$.quantity": 1 } }).then(() => {
        //         //         console.log('updated');
        //         //     })
        //         newItem = false;

        //         console.log("old item qty increased");
        //         break;

        //     }
        // }
        // if (newItem) {
        //     console.log("new item");

            await Cart.findOneAndUpdate({ userId: id }, { $push: { cart: { product: productid, quantity: 1 ,price:price , sub_total:price} } })


            console.log("new item pushed");

        // }
    }
    // console.log(userCart);

    res.json({ status: true });

});


cartRouter.get('/delete/:product/:weight',auth.isUser, async (req, res) => {
    const user = req.session.user;
    const {product,weight} = req.params;
    await Cart.findOneAndUpdate({ userId: user._id , 'cart.weight':weight}, { $pull: { cart: { product: product } } });
    res.json({ status: true });

});
cartRouter.post('/change-quantity',auth.isUser, async (req, res) => {
    let user = req.session.user;
    let id = user._id;
    let {proId,wt,price,count,qty} = req.body;
    console.log(proId+" proid");
    // let cart = await Cart.findOne({userId:user._id});
    console.log(req.body );
    // let carts = await Cart.findOne({ userId: id }).populate("cart.product");
    // if(wt=0.5){
        if(count > 0){

            Cart.updateOne({ userId: id,"cart.product": proId,"cart.weight":wt},{$inc:{"cart.$.quantity":count,"cart.$.sub_total":  price}}).then((res)=>{
                console.log( res+'updated qty nf total' + proId);
            });
        }else{
            Cart.updateOne({ userId: id,"cart.product": proId,"cart.weight":wt},{$inc:{"cart.$.quantity":count,"cart.$.sub_total":  -price}}).then(()=>{
                console.log('updated qty nf total');
        });
        }

    // }else if(wt==2){
    //     Cart.updateOne({ userId: id,"cart.product": proId},{$inc:{"cart.$.quantity":count,"cart.$.sub_total":  price}})

    // }else{
    //  Cart.updateOne({ userId: id,"cart.product": proId},{$inc:{"cart.$.quantity":count,"cart.$.sub_total":  parseInt(price)}})
    //  .then((data)=>{

    //      console.log(data + "res");
    //  });
    // }
        res.json({status:true});
})

cartRouter.post('/change-weight',auth.isUser,async(req,res)=>{
    let  id =req.session.user._id;
    let {proId,proprice,cartprice,wt,qty} = req.body;
    proprice = parseInt(proprice);

    if(wt==0.5){

        await Cart.updateOne({ userId: id, "cart.product": proId },
        { $set: { "cart.$.weight": wt , "cart.$.price" : ( parseFloat( (proprice * wt) + proprice*10/100).toFixed(0)) ,
         "cart.$.sub_total": qty * parseFloat( (proprice * wt) + proprice*10/100).toFixed(0)} })

    }else if(wt==2){
       
        await Cart.updateOne({ userId: id, "cart.product": proId },
        { $set: { "cart.$.weight": wt , "cart.$.price" : parseFloat((proprice * wt) - proprice*10/100).toFixed(0),
        "cart.$.sub_total": qty * (parseFloat( (proprice * wt) - proprice*10/100).toFixed(0)) } })
 
    }else{

        await Cart.updateOne({ userId: id, "cart.product": proId },
        { $set: { "cart.$.weight": wt , "cart.$.price" : proprice , "cart.$.sub_total" : qty * proprice} })

    }
    console.log('updated weight');
    res.json({status:true});


}) 

cartRouter.get('/place-order',auth.isUser,async(req,res)=>{
    let user = req.session.user;
    // let address = null;
    let address = await Address.findOne({userId:user._id});
    // address = address.details;
    console.log(address);
    let total = req.session.total;
    let shipping;
    if(total>2500){
        shipping = 0;
    }else{
        shipping = 100;
    }
    total= total+shipping;
    console.log(total);
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
    res.render('user/place-order',{user,count,wishcount,address,total});

})

cartRouter.post('/place-order/select-address',auth.isUser,async(req,res)=>{
    let addressIndex = req.body.addressIndex;
    let user = req.session.user;
    // console.log(addressIndex );
    let address = await Address.findOne({userId:user._id});
    let change = address.details.map((item)=>{
         item.select = false;
         return item;
    });
    await Address.findOneAndUpdate({userId:user._id},{$pull:{details:{}}}).then((res)=>{
        console.log(res);
    });
    await Address.findOneAndUpdate({userId:user._id},{$push:{details:change}}).then((res)=>{
        console.log(res);
    });
    // console.log(change);
    Address.findOne({userId:user._id}).then((res)=>{
    let item = res.details[addressIndex];
    item.select = true;
    res.save();
    });
    
    // console.log(selectAddress + "slelehjjhf");
    // address = address.details;
    // address = address[addressIndex] ;
    res.json({status:true})
})

cartRouter.post('/payment',auth.isUser,async(req,res)=>{
    let user = req.session.user
    let paymentMethod = req.body.payment;
    let total = req.session.total;
    let carts = await Cart.findOne({ userId: user._id }).populate("cart.product");
    let address = await Address.findOne({userId:user._id});
    let orders = await Order.findOne({userId:user._id});
    let selectAddress = address.details.filter((item)=>{
        return item.select == true;
    })
    // console.log(carts.cart + ' ..  carts')
    let cart = carts.cart;
    let products = cart.map((item)=>{
        return item.product;
    })
    let shipping;
    if(total>2500){
        shipping = 0;
    }else{
        shipping = 100;
    }
    total= total+shipping;
    let status;

        if(paymentMethod == 'COD') status = 'placed' ;
        else status = 'pending';
        if(orders){
            console.log('orders is there');
            await Order.findOneAndUpdate({userId:user._id},{$push:{orders:{address : selectAddress[0],
                orderDetails : cart,
                products:products,
                total : total,
                date : new Date(),
                status : status,
                deliveryDate : new Date(+new Date() + 1*24*60*60*1000)}}});
            console.log('orders is updated');

        }else{
            console.log('orders is not there');

            let order = new Order({
                userId : user._id,
                orders : [
                   { address : selectAddress[0],
                    orderDetails : cart,
                    products:products,
                    total : total,
                    date : new Date(),
                    status : status,
                    deliveryDate : new Date(+new Date() + 1*24*60*60*1000)}
                ]
            });
            order.save();
            
            
        }
            await Cart.findByIdAndUpdate({_id:carts._id},{$pull:{cart:{}}}).then((res)=>{
                console.log(res + "deleted cart")
            })
       if(status == 'placed'){
            console.log(status +'  sttrts ');
           res.json({codStatus: status});

       }else if (status== 'pending'){
        let order = await Order.findOne({userId:user._id});
        console.log("" + orders._id);
        let options = {
            amount: parseInt(total),  // amount in the smallest currency unit
            currency: "INR",
            receipt: ""+order._id
          };
          instance.orders.create(options, function(err, order) {
            if(err) console.log(err);
            console.log(order + ' new order');
            res.json(order)
          });
        
       }
       
})

cartRouter.get('/verify-payment',(req,res)=>{
    
})

cartRouter.get('/place-order/success',auth.isUser,async(req,res)=>{
    let user = req.session.user;
    // let order = await Order.findOne({userId:user._id}).populate([
    //     {path:'cart',
    //         populate : {
    //             path : 'cart',
    //             model : 'Cart'
    //         }
    //     }
    //     ,
    //     {
    //         path: 'products',
    //         model : 'Product'
    //     }
    // ]);
    // // console.log(order);
    // let cartItems = order.cart.cart;
    // console.log(cartItems + 'items');
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
    let total = req.session.total;
    let shipping;
    if(total>2500){
        shipping = 0;
    }else{
        shipping = 100;
    }


    res.render('user/order-success',{user,count,wishcount,total,shipping})
})


module.exports = cartRouter;
