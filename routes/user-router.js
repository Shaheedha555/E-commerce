const express = require('express');
const userRouter = express.Router();

userRouter.get('/',(req,res)=>{
    res.render('login');
});


userRouter.get('/register',(req,res)=>{
    res.render('signup');
});


userRouter.get('/login',(req,res)=>{
    res.render('login');
});










 module.exports  =  userRouter