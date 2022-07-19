const express = require('express');
const adminRouter = express.Router();
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash
}
// const spassword =  securePassword("muhsin");

// let admin = new Admin({
//     name : "Muhsin",
//     email : "muhsinamk@gmail.com",
//     contact : 9746608017,
//     password : spassword
// });
// const adminData =  admin.save()


adminRouter.get('/',(req,res)=>{
    if(req.session.admin) res.redirect('/admin/dashboard')
    else res.render('admin/login-ad');
});

adminRouter.post('/',async (req,res)=>{

    const adminMail = "muhsinamk@gmail.com";
    const adminPassword ="muhsin";
    const {email,password} = req.body;
    // const data = await Admin.findOne({ email })
    if (adminMail===email && adminPassword ===password) {
        console.log('admin dash');
        req.session.admin = true;
        res.redirect('/admin/dashboard')


    }else{
        return res.redirect('/admin')

    }
    // const passwordMatch = await bcrypt.compare(password, data.password)
    // if (!passwordMatch) {
    //     console.log('admin password not match');


    // }
});


// adminRouter.get('/login',(req,res)=>{
//     res.redirect('/admin');
// });

adminRouter.get('/dashboard',(req,res)=>{
    if(req.session.admin) res.render('admin/homepage-ad');
    else return res.redirect('/admin')
});

adminRouter.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
});









 module.exports  =  adminRouter