const express = require('express');
const categoryRouter = express.Router();
const Category = require('../models/categoryModel');

const auth = require('../config/auth');
const { check, validationResult } = require('express-validator');

const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req,file,cb) {
        cb(null,'public/images/category-img');
    },
    filename : function (req,file,cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null,name);
    }
})

const upload = multer({storage : storage})



categoryRouter.get('/',auth.isAdmin, (req,res)=>{
    Category.find( (err,categories)=>{
        if (err) return console.log(err);
        // const message = req.flash('message')
        const admin = req.session.admin;

        res.render('admin/category',{categories : categories,admin});

    });

});

categoryRouter.get('/add-category',auth.isAdmin,(req,res)=>{

    const admin = req.session.admin;
    const title = ""
    res.render('admin/add-category',{admin,title});
});

categoryRouter.post('/add-category',upload.single('image'), function (req, res) {
 
    let title = req.body.title.replace(/\s+/g, '-').toUpperCase();
    let slug = title.replace(/\s+/g, '-').toLowerCase();
    let image = req.file.filename;

     
        Category.findOne({slug}, function (err, category) {

            if (category) {
                // req.flash('danger', 'Category title exists, choose another.');
                console.log("cat exists");
                res.redirect('/admin/category/add-category');
            } else {
                let category = new Category({
                    title: title,
                    slug :slug,
                    image: image
                    
                });

                category.save(function (err) {
                    if (err){
                        console.log('error in saving');

                        return console.log(err);
                    }
                       

                    Category.find(function (err, categories) {
                        if (err) {
                            console.log(err);
                            console.log('error in finding');

                        } else {
                            req.app.locals.categories = categories;
                        }
                    });
 
                   
                });
            }
        
         req.flash('success', 'Category added!');
                    res.redirect('/admin/category');
    

});
});

categoryRouter.get('/edit-category/:id',auth.isAdmin,(req,res)=>{
    Category.findById(req.params.id, (err,category)=>{
        if(err) return console.log(err);
        const admin = req.session.admin;

        res.render('admin/edit-category',{admin,
            title: category.title,
            image : category.image,
            id : category._id
        })
    })
})

categoryRouter.post('/edit-category/:id',(req,res)=>{
    const title = req.body.title;
    const image = req.file.filename;
    const id = req.params.id;
       
        Category.findOne({title: title,_id: {$ne: id}},(err,category)=>{
            if (category){
                res.redirect('/admin/category/edit-category/'+id)
            }else{
                Category.findByIdAndUpdate({_id:id},{$set:{title:title , image:req.file.filename}}).then((categories)=>{
                    category.save((err)=>{
                        if(err) return console.log(err);
                        res.redirect('/admin/category');
                    })
                }).catch((err)=> console.log(err))
                     
                    
                }
            })
        })



categoryRouter.get('/delete-category/:id',auth.isAdmin,(req,res)=>{
    Category.findByIdAndRemove(req.params.id,(err)=>{
        if(err) return console.log(err);
        res.redirect('/admin/category');
    });
});



module.exports = categoryRouter 