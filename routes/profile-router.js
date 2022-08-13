const express = require('express');
const profileRouter = express.Router();
const Address = require('../models/addressModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Wishlist = require('../models/wishlistModel');

const auth = require('../config/auth');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcrypt');
const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash;
}
const storage = multer.diskStorage({
    destination : function(req,file,cb) {
        cb(null,'public/images/user-img');
    },
    filename : function (req,file,cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null,name);
    }
})

const upload = multer({storage : storage})


profileRouter.get('/',auth.isUser,async(req,res)=>{

    let user = req.session.user
    let id = user._id;
    const userData = await User.findOne({_id:id})
    let address = await Address.findOne({userId:id});
    // address = address.details ;
    const error = req.flash('error');
    const success = req.flash('success');
    let count = null;
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
    res.render('user/user-profile',{user:userData,address,success,error,count,wishcount});

});


profileRouter.post('/edit-profile',auth.isUser,upload.single('image'),(req,res)=>{

    let user = req.session.user;
    let id = user._id;
    let {name,email,contact,pimage} = req.body;
    let image = typeof req.file !== "undefined" ? req.file.filename : "";
    // let image = req.file.filename;
    User.findById((id),(err,user)=>{
        if (err) console.log(err);

        if(image == ""){
            user.name = name;
            user.image = pimage;
            user.contact = contact;
            user.save(()=>{
                res.redirect('/profile');
            })
        }else{

            // if(user.email== email){
                user.name = name;
                user.image = image;
                user.contact = contact;
    
                user.save(()=>{
                    if (image !== ""){
                        console.log('image is already there');
    
                        if(user.image !== ""){
                            console.log('image updated');
    
                            fs.unlink('public/images/user-img/'+pimage ,(err)=>{
                                if(err) console.log(err);
                                console.log('old img deleted');
    
                            })
                        }
    
                    }
                    res.redirect('/profile');
                })
        }
        // }else{
        //     res.send('verify email');
        // }
    })
})


profileRouter.post('/add-address',auth.isUser,async(req,res)=>{
    let user = req.session.user;
    let id = user._id;
    console.log(id);
    let {name,housename,landmark,street,pin,contact,district,state,country} = req.body;
    console.log(req.body);
    let addressbook = await Address.findOne({userId:id});
    if(addressbook){
        console.log('addressbook exists');
        await Address.findOneAndUpdate({userId:id},{$push:{details:{name:name,housename:housename,
            landmark:landmark,street:street,pin:pin,contact:contact,district:district,state:state,country:country}}})
    }else{
        console.log('addressbook doesnt exists');

        let newaddress = new Address({
            userId : id,
            details:
            [{name:name,
            housename:housename,
            landmark:landmark,
            street:street,
            pin:pin,
            contact:contact,
            district:district}]
        });
        await newaddress.save();
        console.log('address saved');

    }
        res.redirect('back')
    // console.log(address);
});



profileRouter.post('/change-password',async(req,res)=>{
    let user = req.session.user;
    console.log(user.password);
    let id = user._id;
    let {password,npassword}= req.body;
    console.log(req.body);
    const spassword = await securePassword(password);
    console.log(spassword);

    const snpassword = await securePassword(npassword);
    console.log(snpassword);

    const passwordMatch =await bcrypt.compare(spassword, user.password);
    console.log(passwordMatch);

    if(passwordMatch){

         await User.findByIdAndUpdate((id),{$set:{password:snpassword}});
        req.flash('success','Your password updated successfully.');
        res.redirect('/profile');
    }else{
        req.flash('error','Current password is wrong!');
        res.redirect('/profile');
    }


})








module.exports = profileRouter  ;