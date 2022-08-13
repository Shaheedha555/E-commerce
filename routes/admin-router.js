const express = require('express');
const adminRouter = express.Router();
const auth = require('../config/auth');
const bcrypt = require('bcrypt');
const fs = require('fs');
const Admin = require('../models/adminModel');
const Banner = require('../models/bannerModel');
const Users = require('../models/userModel');
const Category = require('../models/categoryModel');


const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/banner-img');
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
})
const upload = multer({ storage: storage });

let admin;

adminRouter.get('/', (req, res) => {
    if (req.session.admin)
     res.redirect('/admin/dashboard');

    else {
        const error = req.flash('error');
        res.render('admin/login-ad', { error: error });
    }
});

adminRouter.post('/', async (req, res) => {

    const { email, password } = req.body;
    const adminData = await Admin.findOne({ email: email, password: password });

    if (adminData) {

        console.log('admin dash');
        req.session.admin = true;
        res.redirect('/admin/dashboard');

    } else {

        req.flash('error', 'Incorrect email or password');
        return res.redirect('/admin');

    }

});



adminRouter.get('/dashboard',auth.isAdmin, (req, res) => {

        admin = req.session.admin;

        res.render('admin/homepage-ad', { admin });

});

adminRouter.get('/logout', (req, res) => {

    req.session.destroy();
    res.redirect('/admin');

});


adminRouter.get('/banner', auth.isAdmin, async (req, res) => {

    Banner.find((err, banners) => {

        if (err) console.log(err);
        admin = req.session.admin;
        const success = req.flash('success');
        res.render('admin/banner', { banners, admin, success });

    });

});
adminRouter.get('/banner/add-banner', auth.isAdmin, (req, res) => {

    Category.find(function (err, categories) {

        admin = req.session.admin;

        res.render('admin/add-banner',{admin,categories});

    });

});

adminRouter.post('/banner/add-banner', upload.single('banner'), (req, res) => {

    let { title, caption, category } = req.body;
    let banner = req.file.filename;

    let newBanner = new Banner({
        banner,
        title,
        caption,
        category
    });

    newBanner.save((err)=>{
        if (err)
            return console.log(err);

        console.log('error in saving');

        Banner.find(function (err, banners) {

            if (err) {

                console.log(err);
                console.log('error in finding');

            } else {

                req.app.locals.banners = banners;

            }

        });


    });

    req.flash('success', 'banner added successfully');
    res.redirect('/admin/banner');

});

adminRouter.get('/banner/edit-banner/:id', auth.isAdmin, (req, res) => {

    const id = req.params.id
    Banner.findById({ _id: id }, (err, bnr) => {

        console.log(bnr + '   bnr');

        admin = req.session.admin;
        res.render('admin/edit-banner',
            {
                admin,
                id: id,
                title: bnr.title,
                caption: bnr.caption,
                banner: bnr.banner
            }
        );
    })

});

adminRouter.post('/banner/edit-banner/:id', upload.single('banner'), (req, res) => {

    const id = req.params.id;
    const { title, caption, pimage } = req.body;
    const banner = req.file.filename;

    Banner.findById({ _id: id }, async (err, bnr) => {

        if (err) console.log(err);

            bnr.title = title,
            bnr.caption = caption,
            bnr.banner = banner

        await bnr.save((err) => {

            if(err) console.log(err);

            fs.unlink('public/images/admin-img/' + pimage, (err) => {

                if (err) console.log(err);

            });

            req.flash('success', 'banner edited successfully.')
            res.redirect('/admin/banner');

        });

    });

});

adminRouter.get('/banner/delete/:id', auth.isAdmin, (req, res) => {

    Banner.findById(req.params.id, (err, bnr) => {

        if (err) return console.log(err);

        const banner = bnr.banner;

        fs.unlink('public/images/banner-img/' + banner, (err) => {

            if (err) console.log(err);

            console.log('old img deleted');

        });

        Banner.deleteOne(bnr, () => {

            res.redirect('/admin/banner');

        });

    });

});


adminRouter.get('/users', auth.isAdmin, async (req, res) => {

    let count = await Users.count();

    Users.find((err, users) => {

        if (err) return console.log(err);

        admin = req.session.admin;

        res.render('admin/users', { users: users, admin, count });

    });

});

// adminRouter.get('/users/delete/:id', auth.isAdmin, (req, res) => {

//     Users.findByIdAndRemove(req.params.id, (err) => {

//         if (err) return console.log(err);

//         res.redirect('/admin/users');

//     });

// });

adminRouter.get('/users/block/:id', auth.isAdmin, (req, res) => {

    Users.findByIdAndUpdate(req.params.id, { status: "true" }).then((err) => {

        if (err) console.log(err);

        res.redirect('/admin/users');

    });

});

adminRouter.get('/users/unblock/:id', auth.isAdmin, (req, res) => {

    Users.findByIdAndUpdate(req.params.id, { status: "false" }).then((err) => {

        if (err) console.log(err);

        res.redirect('/admin/users');

    });

});

adminRouter.get('/not', (req, res) => {

    res.render('admin/404');

});


module.exports = adminRouter