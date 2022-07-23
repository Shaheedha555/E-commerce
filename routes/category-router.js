const express = require('express');
const categoryRouter = express.Router();
const Category = require('../models/categoryModel');
const auth = require('../config/auth');
const { check, validationResult } = require('express-validator');

categoryRouter.get('/',auth.isAdmin,(req,res)=>{
    Category.find((err,categories)=>{
        if (err) return console.log(err);
        const message = req.flash('message')

        res.render('admin/category',{categories : categories});

    });

});

categoryRouter.get('/add-category',auth.isAdmin,(req,res)=>{

    var title = "";

    res.render('admin/add-category',{title:title});
});

categoryRouter.post('/add-category',[
    check('title','Must add a title with minimum of 4 letters')
        .notEmpty()
        .isLength({min:4})
], function (req, res) {

    var title = req.body.title.replace(/\s+/g, '-').toUpperCase();
    var image = title.replace(/\s+/g, '-').toLowerCase();

    var errors = validationResult(req);

    if (!errors.isEmpty()) {
        const alert = errors.array();

        res.render('admin/add-category', {
            errors: alert,
            title: title
        });
    } else {
        Category.findOne({image: image}, function (err, category) {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/add-category', {
                    title: title
                });
            } else {
                let category = new Category({
                    title: title,
                    image: image
                });

                category.save(function (err) {
                    if (err)
                        return console.log(err);

                    Category.find(function (err, categories) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.categories = categories;
                        }
                    });

                   
                });
            }
        });
         req.flash('success', 'Category added!');
                    res.redirect('/admin/category');
    }

});

categoryRouter.get('/edit-category/:id',(req,res)=>{
    Category.findById(req.params.id, (err,category)=>{
        if(err) return console.log(err);
        res.render('admin/edit-category',{
            title: category.title,
            id : category._id
        })
    })
})

categoryRouter.post('/edit-category/:id',[
    check('title','title must have a value')
    .notEmpty()
],(req,res)=>{
    const errors = validationResult(req);
    const title = req.body.title;
    const id = req.params.id;
    if(!errors.isEmpty()){
        console.log(errors);
        redirect('/admin/category/edit-category');
    }else{
        Category.findOne({title: title,_id: {$ne: id}},(err,category)=>{
            if (category){
                res.redirect('/admin/category/edit-category')
            }else{
                Category.findById(id,(err,category)=>{
                    if(err) return console.log(err);

                    category.title = title;
                    category.save((err)=>{
                        if(err) return console.log(err);
                        res.redirect('/admin/category');
                    })
                })
            }

        })
    }

})

categoryRouter.get('/delete-category/:id',(req,res)=>{
    Category.findByIdAndRemove(req.params.id,(err)=>{
        if(err) return console.log(err);
        res.redirect('/admin/category');
    });
});



module.exports = categoryRouter