const express = require('express');
const app = express();
const categoryRouter = express.Router();
const Category = require('../models/categoryModel');
const auth = require('../config/auth');
const { check, validationResult } = require('express-validator');

categoryRouter.get('/',auth.isAdmin,(req,res)=>{
    Category.find((err,categories)=>{
        if (err) return console.log(err);
        res.render('admin/category',{categories : categories});

    });

});

categoryRouter.get('/add-category',auth.isAdmin,(req,res)=>{

    const title = "";
    const message = req.flash('message')

    res.render('admin/add-category',{title:title});
});

categoryRouter.post('/add-category',[
    check('title','Must add a title with minimum of 4 letters')
        .isLength({min:4})
], async function  (req, res) {

    var title = req.body.title;
    var image = title.toLowerCase();
    var errors = validationResult(req);

    if (!errors.isEmpty()) {

        const alert = errors.array();
        req.flash('danger','Enter a title with minimum of 4 letters')
        res.redirect('/admin/category/add-category');
    } else {
        const cat = await Category.findOne({title: title});
        console.log('finding cat');

        if(cat){
            res.send('already exists')
        }else{
            const categories = new Category({
                title: title,
                image: image
            });
            const savedCategory = await categories.save();
            console.log('saved cat');

            if(savedCategory){
                        req.flash('success', 'Category added!');
                        res.redirect('/admin/category');
                        }else{
                         req.flash('danger', 'Category not added!');
                             res.redirect('/admin/category');
                    }

        }

        // ,async function (err, category) {
        //     if (category) {
        //         req.flash('danger', 'Category title exists, choose another.');
        //         res.render('admin/add-category', {
        //             title: title
        //         });
        //     } else {
                

        //        const category = await categories.save();

        //        if(category){
        //         req.flash('success', 'Category added!');
        //         res.redirect('/admin/category');
        //        }else{
        //         req.flash('danger', 'Category not added!');
        //             res.redirect('/admin/category');
        //        }

                
            } 
        });



module.exports = categoryRouter