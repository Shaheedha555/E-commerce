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
    
    else{
        const error = req.flash('error');
        res.render('admin/login-ad',{error:error});
    } 
});

adminRouter.post('/',async (req,res)=>{
    const {email,password} = req.body;
    const adminData = await Admin.findOne({email: email , password : password});

    if (adminData) {
        console.log('admin dash');
        req.session.admin = true;
        res.redirect('/admin/dashboard')


    }else{
        req.flash('error','Incorrect email or password')
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


adminRouter.get('/banner/delete/:id',auth.isAdmin,(req,res)=>{
    Banner.findByIdAndRemove(req.params.id,(err)=>{
        if(err) return console.log(err);
        res.redirect('/admin/banner');
    });
});


adminRouter.get('/users',auth.isAdmin, (req,res)=>{
    let count;
    Users.count((err,c)=>{
        if(err) console.log(err);
        count = c
    })
    Users.find( (err,users)=>{
        if (err) return console.log(err);
        // const message = req.flash('message')
        const admin = req.session.admin;

        res.render('admin/users',{users : users,admin,count});

    });

});

adminRouter.get('/users/delete/:id',auth.isAdmin,(req,res)=>{
    Users.findByIdAndRemove(req.params.id,(err)=>{
        if(err) return console.log(err);
        res.redirect('/admin/users');
    });
});

adminRouter.get('/users/block/:id',auth.isAdmin,(req,res)=>{
    
    Users.findByIdAndUpdate(req.params.id,{status : "true"}).then((err)=>{
        if (err) console.log(err);
        res.redirect('/admin/users');
    })
    
})
adminRouter.get('/users/unblock/:id',auth.isAdmin,(req,res)=>{
    Users.findByIdAndUpdate(req.params.id,{status : "false"}).then((err)=>{
        if (err) console.log(err);
        res.redirect('/admin/users');
    })
    
})

 module.exports  =  adminRouter