const express = require('express');
const adminRouter = express.Router();
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');



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
    if(req.session.admin) res.render('admin/homepage-ad');
    else return res.redirect('/admin')
});

adminRouter.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
});









 module.exports  =  adminRouter