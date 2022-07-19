const express = require('express');
const userRouter = express.Router();
const User = require('../models/userModel');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash
}



userRouter.get('/', (req, res) => {
    if (req.session.user) res.redirect('/home')
    else res.render('user/homepage');


});
userRouter.get('/register', (req, res) => {
    const message = req.flash('message')
    res.render('user/signup')


});

userRouter.post('/register', [
    check('name', 'Enter a name with minimum of 4 letters')
        .exists()
        .isLength({ min: 4 }),
    check('email', 'Enter a valid email')
        .exists()
        .isEmail(),
    check('contact', 'Enter a 10 digit Mobile No.')
        .exists()
        .isNumeric()
        .isLength({ min: 10, max: 10 }),
    check('password', 'Password at least should be 6 characters')
        .exists()
        .isLength({ min: 6 }),
    check('cpassword', 'Password is not matching')
        .custom(async (cpassword, { req }) => {
            const password = req.body.password


            if (password !== cpassword) {
                throw new Error('Passwords must be same')
            }
        }),

], async (req, res) => {
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const alert = errors.array();
        res.render('user/signup', { alert })
    } else {
        const { name, email, contact, password, cpassword } = req.body;
        let user = await User.findOne({ email })

        if (user) {
            req.flash('message',`This Email is already registered  in the name '${user.name}'`)
            return res.redirect('/register')
        }
        const spassword = await securePassword(req.body.password)
        user = new User({
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact,
            password: spassword,

        })


        const userData = await user.save()

        req.session.user = userData

        return res.redirect('/home')




    }


});

userRouter.get('/login', (req, res) => {

    if (req.session.user) { res.redirect('/home') }

    else {

        const message = req.flash('message')

        res.render('user/login') 

        }



})
userRouter.post('/login', [
    check('email', 'Enter valid email')
        .exists()
        .isEmail(),
    check('password', 'Enter your password')
        .exists()
        .isLength({ min: 6 })
], async (req, res) => {

    errors = validationResult(req)

    if (!errors.isEmpty()) {

        const alert = errors.array();

        res.render('user/login', { alert })

    } else {

        const { email, password } = req.body

        const userData = await User.findOne({ email })

        if (!userData) {

            req.flash('message','No User found!')
            return res.redirect('/login')


        }
        const passwordMatch = await bcrypt.compare(password, userData.password)
        if (!passwordMatch) {

            req.flash('message','Your Password is wrong!')

            return res.redirect('/login')


        }

        req.session.user = userData


        res.redirect('/home')
    }

})
userRouter.get('/home', (req, res) => {

    console.log(req.session.user)

    if (req.session.user) {
        const user = req.session.user
        res.render('user/homepage', { user: user.name })
    } else {
        
        res.redirect('/login')

    }

})
userRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {

        if (err) throw err;
    })

        res.redirect("/login");
})


module.exports = userRouter