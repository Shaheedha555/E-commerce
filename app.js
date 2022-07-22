const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000 ;
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser')
const session = require('express-session')
const cookie = require('cookie-parser')
// const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const nocache = require("nocache");
const userRouter = require('./routes/user-router')
const adminRouter = require('./routes/admin-router')
const categoryRouter = require('./routes/category-router')

mongoose.connect(config.database)
    .then(()=>{console.log('Database Connected')})
    .catch((err)=>{console.log('Database connection failed')});

console.log(mongoose.connection.readyState);

app.set('view engine','ejs');

app.use(nocache());
app.use(cookie('cookieSecret'))
app.use(session({
    secret : "sessionSecret",
    resave : true,
    saveUninitialized : true,
    cookie:{ maxAge:60*1000,secure:false}
}))

app.use('/views',express.static(path.join(__dirname,'views')));
app.use('/public',express.static(path.join(__dirname,'public')));
app.use('/public',express.static(path.join(__dirname,'public/styles/')));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(flash());
app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});

app.use('/',userRouter);
app.use('/admin',adminRouter);
app.use('/admin/category',categoryRouter);


app.listen(port,()=>{
    console.log(`Listening to the server on http://localhost:${port}`);
});