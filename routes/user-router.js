const express = require('express');
const userRouter = express.Router();
const User = require('../models/userModel');
const Banner = require('../models/bannerModel');
const Address = require('../models/addressModel');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const EmailVerification = require('../models/userEmailverification')
const Wishlist = require('../models/wishlistModel');

const nodemailer = require("nodemailer");
const auth = require('../config/auth')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash;
}
const secureString = async (uniqueString) => {
    const stringHash = await bcrypt.hash(uniqueString, 10)
    return stringHash;
}
const { v4: uuidv4 } = require('uuid');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shaheedhamolshahi@gmail.com',
        pass: 'thkgpudocbmdymjh',
    },
});

transporter.verify((err, success) => {
    if (err) console.log(err);
    else {
        console.log('ready for messages');
        console.log(success);
    }
});

const sendVerificationEmail = async ({ _id, email }, res) => {
    try {
        const url = "http://localhost:4000/"
        const uniqueString = uuidv4()
        const mailOptions = {
            from: 'shaheedhamolshahi@gmail.com',
            to: email,
            subject: 'Verify email',
            html: `<p>Please verify your email to complete the registration process.
             Click <a href="${url + 'verify?userId=' + _id + '&uniqueString=' + uniqueString}">here</a> to verify.
             <p>This link will <b>expire in 2 hrs</b>.</p>`
        };
        const hashedString = await secureString(uniqueString);
        const newEmailVerification = await new EmailVerification({
            userId: _id,
            uniqueString: hashedString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 1000 * 60 * 60 * 2
        })

        await newEmailVerification.save();
        await transporter.sendMail(mailOptions);
        // req.flash('success','Verification email is sent.Please verify your email')
        res.redirect('/register')

    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
}

userRouter.get('/', async (req, res) => {
    // if (req.session.user) res.redirect('/home')
    // else res.render('user/homepage');
    const user = req.session.user
    const banners = await Banner.find({});
    const categories = await Category.find({});
    const specials = await Product.find({ special: true });
    let count = null;
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
        console.log(count);
    res.render('user/homepage', { user, banners, categories, specials ,count , wishcount});



});
// userRouter.get('/home', (req, res) => {

//     if (req.session.user) {

//     } else {

//         res.redirect('/login')

//     }

// })


userRouter.get('/register', (req, res) => {
    if (req.session.user) res.redirect('/home');
    else {
        const error = req.flash('error');
        const success = req.flash('success');

        res.render('user/signup', { error: error, success: success })
    }



});

userRouter.post('/register', async (req, res) => {

    const { name, email, contact, password, image } = req.body;
    let user = await User.findOne({ email })

    if (user) {
        req.flash('error', `This Email is already registered  in the name '${user.name}'`)
        return res.redirect('/register')
    }
    const spassword = await securePassword(password)
    user = new User({
        name: name,
        email: email,
        contact: contact,
        password: spassword,
        verified: false,
        image: image,
        status: false

    })

    user.save().then((result) => {
        let address = new Address({
            userId: result._id,
            details: []
        })
        address.save(() => {

            sendVerificationEmail(result, res);
            console.log(result);

            req.flash('success', 'Verification email hasbeen sent. please check your email at https://mail.google.com/mail')
        })
    })
        .catch((err) => {
            console.log(err);
        })
    // req.session.user = user




});




userRouter.get('/verify', async (req, res) => {

    let { userId, uniqueString } = req.query;
    console.log(userId);
    console.log(uniqueString);
    EmailVerification.find({ userId })

        .then((result) => {
            if (result.length > 0) {
                const { expiresAt } = result[0];
                const hashedString = result[0].uniqueString;
                if (expiresAt < Date.now()) {
                    console.log('expired');
                    EmailVerification.findOneAndDelete({ userId })
                        .then((result) => {
                            User.findByIdAndDelete({ _id: userId })
                                .then(() => {
                                    console.log('signup again due to expired link');
                                    req.flash('error', `Your verification link has expired.Signup again`)

                                    res.redirect('/register')
                                })
                                .catch((error) => {
                                    console.log('err in user deletion');

                                })
                        })
                        .catch((error) => {
                            console.log(error);
                            console.log('err in email deletion');
                        })
                } else {
                    bcrypt.compare(uniqueString, hashedString)
                        .then((result) => {
                            if (result) {
                                User.updateOne({ _id: userId }, { $set: { verified: true } })
                                    .then(() => {
                                        EmailVerification.deleteOne({ userId })
                                            .then(() => {
                                                req.flash('success', 'Your email has been verified.Go and Login now !')

                                                res.redirect('/register')
                                            })
                                            .catch(error => {
                                                console.log(error);
                                            })
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    })
                            } else {
                                req.flash('error', `Verification link is not valid.Signup again.`)

                                res.redirect('/register')
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }
            } else {
                req.flash('error', `No registered User found`)

                res.redirect('/register')
            }
        })
        .catch((error) => {
            console.log(error);
            console.log('error in find');

        })

});

userRouter.get('/login', (req, res) => {

    if (req.session.user) { res.redirect('/') }

    else {

        const error = req.flash('error');
        const success = req.flash('success');
        res.render('user/login', { error: error, success: success })

    }



})
userRouter.post('/login', async (req, res) => {


    const { email, password } = req.body

    const userData = await User.findOne({ email })

    if (!userData) {

        req.flash('error', 'No User found!')
        return res.redirect('/login')


    }
    const passwordMatch = await bcrypt.compare(password, userData.password)
    if (!passwordMatch) {

        req.flash('error', 'Your Password is wrong!')

        return res.redirect('/login')


    }
    if (userData.verified !== true) {
        req.flash('error', 'Your email is not verified! Go to your inbox and verify.')

        return res.redirect('/login')
    }
    if (userData.status) {
        req.flash('error', 'Your account is blocked by admin.')

        return res.redirect('/login')
    }
    req.session.user = userData


    res.redirect('/')


});

userRouter.get('/about',async (req,res)=>{
    const user = req.session.user;
    let count = null;   
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
    res.render('user/about',{user,count,wishcount});

});

userRouter.get('/contact',async(req,res)=>{
    const user = req.session.user;
    let count = null;
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
    res.render('user/contact',{user,count,wishcount});

});


userRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {

        if (err) throw err;
    })
    res.redirect("/login");
})








module.exports = userRouter