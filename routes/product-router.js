const express = require('express');
const productRouter = express.Router();
const Product = require('../models/productModel');
const fs = require('fs');
const auth = require('../config/auth');

const multer = require('multer');
const Category = require('../models/categoryModel');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/product-img');
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
})

const upload = multer({ storage: storage })



productRouter.get('/', auth.isAdmin, (req, res) => {
    let count;
    Product.count((err, c) => {
        count = c;
        Product.find(async (err, products) => {

            if (err) return console.log(err);
            const admin = req.session.admin;
            const success = req.flash('success')

            res.render('admin/products', { products: products, count: count, success: success, admin });

        });
    })


});

productRouter.get('/add-product', auth.isAdmin, (req, res) => {
    let title = "";
    let description = "";
    let price = "";
    Category.find(function (err, categories) {
        const admin = req.session.admin;
        const error = req.flash('error')

        res.render('admin/add-product',
            {
                admin,
                error: error,
                title: title,
                description: description,
                categories: categories,
                price: price
            }
        );

    });

});

productRouter.post('/add-product', upload.single('image'), function (req, res) {

    let { description, price, category } = req.body;
    let title = req.body.title.replace(/\s+/g, '-').toUpperCase();
    let slug = req.body.title.replace(/\s+/g, '-').toLowerCase();
    let image = typeof req.file !== "undefined" ? req.file.filename : "";

    Product.findOne({ slug: slug, category: category }, function (err, product) {
        if (err) {
            console.log('error in cat find');

            return console.log(err);
        }
        if (product) {
            console.log("pro exists");
            fs.unlink('public/images/product-img/' + image, (err) => {
                if (err) console.log(err);
                console.log('old img deleted');
            });
            req.flash('error', 'Product exists, choose another.');
            return res.redirect('/admin/product/add-product');
        } else {
            let price2 = parseFloat(price).toFixed(2);
            let product = new Product({
                title: title,
                slug: slug,
                description: description,
                price: price2,
                category: category,
                image: image,
                images: []

            });

            product.save(function (err) {
                if (err) {
                    return console.log(err);
                }

                Product.find(function (err, products) {
                    if (err) {
                        console.log(err);
                        console.log('error in finding');

                    } else {
                        req.app.locals.products = products;
                    }
                });


            });
        }

        req.flash('success', 'Product added!');
        res.redirect('/admin/product');


    });
});

productRouter.get('/edit-product/:id', auth.isAdmin, (req, res) => {
    Category.find(function (err, categories) {
        if (err) {
            console.log(err);
        }
        Product.findById(req.params.id, (err, product) => {
            if (err) {
                req.flash('error', 'Something went wrong!');

                console.log(err);
                res.redirect('/admin/product');
            }
            const admin = req.session.admin;
            const error = req.flash('error')
            const success = req.flash('success')

            res.render('admin/edit-product', {
                admin,
                success: success,
                error: error,
                title: product.title,
                description: product.description,
                categories: categories,
                category: product.category,
                image: product.image,
                price: product.price,
                id: product._id,
                gallery: product.images
            })
        })
    })


})

productRouter.post('/edit-product/:id', upload.single('image'), (req, res) => {
    let title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase();
    let pimage = req.body.pimage;
    let image = typeof req.file !== "undefined" ? req.file.filename : "";
    let id = req.params.id;
    let description = req.body.description;
    let price = req.body.price;
    let category = req.body.category;
    let price2 = parseFloat(price).toFixed(2);

    Product.findOne({ slug: slug, category: category, _id: { $ne: id } }, (err, product) => {
        console.log('searching for pro');
        if (err) console.log(err);
        if (product) {
            console.log('same product found');
            fs.unlink('public/images/product-img/' + pimage, (err) => {
                if (err) console.log(err);
                console.log('old img deleted');
            });
            req.flash('error', 'Product exists,choose another name.')
            return res.redirect('/admin/product/edit-product/' + id);
        } else {
            console.log('updating pro');

            Product.findById((id), async (err, product) => {
                if (err) console.log(err);
                if(image!==""){

                    product.title = title,
                        product.slug = slug,
                        product.description = description,
                        product.price = price2,
                        product.category = category,
                        product.image = image
                }else{
                    product.title = title,
                    product.slug = slug,
                    product.description = description,
                    product.price = price2,
                    product.category = category,
                    product.image = pimage
                }

                await product.save((err) => {
                    console.log('saving pro');

                    if (err) return console.log(err);
                    if (image !== "") {
                        console.log('image is already there');

                        if (product.image !== "") {
                            console.log('image updated');

                            fs.unlink('public/images/product-img/' + pimage, (err) => {
                                if (err) console.log(err);
                                console.log('old img deleted');

                            })
                        }

                    }
                    req.flash('success', 'Product edited successfully.')
                    res.redirect('/admin/product');
                })
            }).catch((err) => console.log(err))


        }
    })
})

productRouter.post('/edit-product/add-gallery/:id', upload.array('images', 5),async (req, res) => {

    let id = req.params.id;
    console.log(id);
    let images = req.files;

    if (images.length > 0) {
        let imageName = images.map((img) => {
            return img.filename;
        })

        await imageName.map((img) => {
            Product.findByIdAndUpdate({ _id: id }, { $push: { images: img } })
                .then((pro) => {
                    pro.save(() => {
                        console.log('saved');
                    })

                })
                
            })
            req.flash('success', 'gallery added!');
            res.redirect('/admin/product/edit-product/' + id);
    } else {
        res.redirect('/admin/product');
    }

})

productRouter.get('/edit-product/delete-gallery/:id/:img', auth.isAdmin, (req, res) => {
    let id = req.params.id;
    let img = req.params.img;

    Product.findById((id), async (err, pro) => {
        pro.images.pull(img);
        await pro.save(() => {
            fs.unlink('public/images/product-img/' + img, (err) => {
                if (err) console.log(err);
                console.log('old img deleted');

            })
            res.redirect('/admin/product/edit-product/' + id);
        })

    })
})


productRouter.get('/delete-product/:id', auth.isAdmin, (req, res) => {

    Product.findById(req.params.id, (err, pro) => {
        if (err) return console.log(err);
        fs.unlink('public/images/product-img/' + pro.image, (err) => {
            if (err) console.log(err);
            console.log('old img deleted');

        });
        pro.images.map((img) => {
            return fs.unlink('public/images/product-img/' + img, (err) => {
                if (err) console.log(err);
                console.log('old imgs deleted');

            });
        })

        Product.deleteOne(pro, () => {
            req.flash('success', `Product deleted successfully!`);

            res.redirect('/admin/product');
        })

    });

});



module.exports = productRouter