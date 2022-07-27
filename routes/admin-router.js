const express = require('express');
const adminRouter = express.Router();
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const Banner = require('../models/bannerModel');
const Users = require('../models/userModel');
const auth = require('../config/auth');


const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req,file,cb) {
        cb(null,'public/images/admin-img');
    },
    filename : function (req,file,cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null,name);
    }
})

const upload = multer({storage : storage})



adminRouter.get('/',(req,res)=>{
    if(req.session.admin) res.redirect('/admin/dashboard')
    
    else res.render('admin/login-ad');
});

adminRouter.post('/',async (req,res)=>{
    const {email,password} = req.body;

    const adminData = Admin.find({email: email , password : password});
    if (adminData) {
        console.log('admin dash');
        req.session.admin = true;
        res.redirect('/admin/dashboard')


    }else{
        return res.redirect('/admin')

    }
   
});



adminRouter.get('/dashboard',(req,res)=>{

    if(req.session.admin){

        const admin = req.session.admin;

        res.render('admin/homepage-ad',{admin});
    }
    else return res.redirect('/admin')
});

adminRouter.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/admin');
});


adminRouter.get('/banner',auth.isAdmin,async (req,res)=>{
    Banner.find((err,banners)=>{
        if(err) console.log(err);
        const admin = req.session.admin;
        res.render('admin/banner',{banners,admin})
 
    })
})

adminRouter.post('/banner',upload.single('banner'),(req,res)=>{
    // let image = req.file.filename;
    let banner = new Banner({
        image : req.file.filename
    })
    banner.save(function (err) {
        if (err)
            return console.log(err);
            console.log('error in saving');

        Banner.find(function (err, banners) {
            if (err) {
                console.log(err);
                console.log('error in finding');

            } else {
                req.app.locals.banners = banners;
            }
        });

       
    });    res.redirect('/admin/banner')
})


adminRouter.get('/banner/delete/:id',(req,res)=>{
    Banner.findByIdAndRemove(req.params.id,(err)=>{
        if(err) return console.log(err);
        res.redirect('/admin/banner');
    });
});


adminRouter.get('/users',auth.isAdmin, (req,res)=>{
    Users.find( (err,users)=>{
        if (err) return console.log(err);
        // const message = req.flash('message')
        const admin = req.session.admin;

        res.render('admin/users',{users : users,admin});

    });

});

adminRouter.get('/users/delete/:id',(req,res)=>{
    Users.findByIdAndRemove(req.params.id,(err)=>{
        if(err) return console.log(err);
        res.redirect('/admin/users');
    });
});


 module.exports  =  adminRouter