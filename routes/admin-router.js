const express = require('express');
const adminRouter = express.Router();




adminRouter.get('/',(req,res)=>{
    res.render('login-ad');
});
adminRouter.get('/login',(req,res)=>{
    res.redirect('/admin');
});







 module.exports  =  adminRouter