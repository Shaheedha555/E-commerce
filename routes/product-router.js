const express = require('express');
const productRouter = express.Router();
const Product = require('../models/productModel');

const auth = require('../config/auth');

const multer = require('multer');
const Category = require('../models/categoryModel');

const storage = multer.diskStorage({
    destination : function(req,file,cb) {
        cb(null,'public/images/product-img');
    },
    filename : function (req,file,cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null,name);
    }
})

const upload = multer({storage : storage})



productRouter.get('/',auth.isAdmin, (req,res)=>{
    Product.find(async (err,products)=>{

        if (err) return console.log(err);
        const admin = req.session.admin;

        res.render('admin/products',{products : products,admin});

    });

});

productRouter.get('/add-product',auth.isAdmin,(req,res)=>{
    let title = "";
    let description = "";
    let price = "";
    Category.find(function(err,categories){
        const admin = req.session.admin;

        res.render('admin/add-product',{admin,
            title:title,
            description:description,
            categories:categories,
            price:price});

    });

});

productRouter.post('/add-product',upload.single('image'), function (req, res) {
 
    let {description,price,category} =  req.body;
    let title = req.body.title.replace(/\s+/g, '-').toUpperCase();
    let slug = req.body.title.replace(/\s+/g, '-').toLowerCase();
    let image = req.file.filename;
    console.log(category);
     
        Product.findOne({slug}, function (err, product) {

            if (product) {
                // req.flash('danger', 'Category title exists, choose another.');
                console.log("pro exists");
                res.redirect('/admin/product/add-product');
            } else {
                let product = new Product({
                    title: title,
                    slug:slug,
                    description : description,
                    price : price,
                    category : category,
                    image: image
                    
                });

                product.save(function (err) {
                    if (err){
                        return console.log(err);
                        }

                    Product.find(function (err, products) {
                        if (err) {
                            console.log(err);
                            console.log('error in finding');

                        } else {
                            console.log(product.category);
                            req.app.locals.products = products;
                        }
                    });
 
                   
                });
            }
        
         req.flash('success', 'Product added!');
                    res.redirect('/admin/product');
    

});
});

productRouter.get('/edit-product/:id',auth.isAdmin,(req,res)=>{
    Category.find(function(err,categories){
        if(err){
            console.log(err);
        } 
        Product.findById(req.params.id, (err,product)=>{
            if(err){
                console.log(err);
                res.redirect('/admin/product');
            } 
            const admin = req.session.admin;

            res.render('admin/edit-product',{admin,
                title: product.title,
                description : product.description,
                categories : categories,
                category : product.category,
                image : product.image,
                price : product.price,
                id : product._id
            })
        })
    })

    
})

productRouter.post('/edit-product/:id',(req,res)=>{
    const title = req.body.title;
    const slug = title.replace(/\s+/g, '-').toLowerCase();
    const image = req.file.filename;
    const id = req.params.id;
    const description = req.body.description;
    const price = req.body.price ;    
    const category = req.body.category;
       
        Product.findOne({slug:slug,_id: {$ne: id}},(err,product)=>{
            if (product){
                res.redirect('/admin/product/edit-product/'+id);
            }else{
                Product.findByIdAndUpdate({_id:id},{$set:{title:title ,slug:slug,description:description,price:price,category:category,image:image}}).then((product)=>{
                    product.save((err)=>{
                        if(err) return console.log(err);
                        res.redirect('/admin/category');
                    })
                }).catch((err)=> console.log(err))
                     
                     
                }
            })
        })



productRouter.get('/delete-product/:id',auth.isAdmin, (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err) => {
        if (err) return console.log(err);
        res.redirect('/admin/product');
    });
});



module.exports = productRouter