const express = require('express');
const adminRouter = express.Router();
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const Banner = require('../models/bannerModel');
const Users = require('../models/userModel');
const auth = require('../config/auth');
const Category = require('../models/categoryModel');
const fs = require('fs')


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
        const success = req.flash('success')
        res.render('admin/banner',{banners,admin,success})
 
    })
})
adminRouter.get('/banner/add-banner',auth.isAdmin,(req,res)=>{
    Category.find(function (err, categories) {
        const admin = req.session.admin;

        res.render('admin/add-banner',
            {
                admin,
                categories: categories            }
        );

    });
})

adminRouter.post('/banner/add-banner',upload.single('banner'),(req,res)=>{
    // let image = req.file.filename;
    let banner = new Banner({
        banner : req.file.filename,
        title : req.body.title,
        caption : req.body.caption,
        category : req.body.category
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

       
    }); 
    req.flash('success', 'banner added successfully');
    res.redirect('/admin/banner');
})

adminRouter.get('/banner/edit-banner/:id',auth.isAdmin,(req,res)=>{
    const id = req.params.id
    Banner.findById({_id:id},(err,bnr)=>{
        
        console.log(bnr  + '   bnr');
        
        const admin = req.session.admin;
        res.render('admin/edit-banner',
            {
                admin,
                id:id,
                title : bnr.title,
                caption: bnr.caption,
                banner : bnr.banner
                         
            }
        );
        })
    
});

adminRouter.post('/banner/edit-banner/:id',upload.single('banner'),(req,res)=>{
    const id =req.params.id;
    const {title,caption,pimage} = req.body;
    const banner = req.file.filename;

    Banner.findById({_id:id},async(err,bnr)=>{
        if (err) console.log(err);
        bnr.title =  title,
        bnr.caption = caption,
        bnr.banner = banner

        await bnr.save((err)=>{

            fs.unlink('public/images/admin-img/' + pimage, (err) => {
                if (err) console.log(err);
                console.log('old img deleted');

            });
            req.flash('success', 'banner edited successfully.')
            res.redirect('/admin/banner');

        })
    })

})

adminRouter.get('/banner/delete/:id',auth.isAdmin,(req,res)=>{
    Banner.findById(req.params.id,(err,bnr)=>{
        if(err) return console.log(err);
        const banner = bnr.banner;
        fs.unlink('public/images/admin-img/' + banner, (err) => {
            if (err) console.log(err);
            console.log('old img deleted');

        });
        Banner.deleteOne(bnr,()=>{

            res.redirect('/admin/banner');
        });
    });
});


adminRouter.get('/users',auth.isAdmin, async(req,res)=>{
    let count = await Users.count();
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

adminRouter.get('/not',(req,res)=>{
    res.render('admin/404');
})
 module.exports  =  adminRouter