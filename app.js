const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 2000 ;
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser')
const session = require('express-session')
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');

const userRouter = require('./routes/user-router')

const adminRouter = require('./routes/admin-router')

mongoose.connect(config.database);
console.log(mongoose.connection.readyState);


app.set('view engine','ejs');

app.use('/views',express.static(path.join(__dirname,'views')));
app.use('/public',express.static(path.join(__dirname,'public')));
app.use('/public',express.static(path.join(__dirname,'public/styles/')));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

app.use(flash());
app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});

app.use('/',userRouter);
app.use('/admin',adminRouter);


app.listen(port,()=>{
    console.log(`Listening to the server on http://localhost:${port}`);
});