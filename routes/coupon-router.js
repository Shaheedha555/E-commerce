const express = require('express');
const couponRouter = express.Router();
const auth = require('../config/auth');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');



couponRouter.get('/',auth.isAdmin, (req,res)=>{

    let count;

    Coupon.count((err,c)=>{

        count = c;
        Coupon.find( (err,coupons)=>{

            if (err) return console.log(err);

            admin = req.session.admin;
            const success = req.flash('success');
            const error = req.flash('error');
    
            res.render('admin/coupons',{coupons,count,admin,success,error});
    
        });

    });
    
});

couponRouter.get('/add-coupon',auth.isAdmin,(req,res)=>{

    admin = req.session.admin;
    const error = req.flash('error');

    res.render('admin/add-coupon',{admin,error});

});

couponRouter.post('/add-coupon', function (req, res) {
 
    let {coupon,offer,expiry,description,minimum} = req.body;
    let date= new Date();
    date = date.toDateString();
    expiry =new Date(expiry).toDateString();
     
        Coupon.findOne({coupon:coupon}, function (err, coupon) {

            if (err)
                return console.log(err);

            if (coupon) {

                console.log("cpn exists");

                
                req.flash('error', 'Coupon already exists, choose another.');
                return res.redirect('/admin/coupon/add-coupon');

            } else {
                console.log(coupon)
                let item = new Coupon({
                                    coupon:req.body.coupon,
                                    offer:offer,
                                    minimum : minimum,
                                    description:description,
                                    date : date,
                                    expiry : expiry
                                });

                item.save(function (err) {
                    console.log(item);
                    if (err)
                        return console.log(err);

                    
 
                   
                });

            }
        
                    req.flash('success', 'Coupon added successfully!');
                    res.redirect('/admin/coupon');
    
});

});

couponRouter.get('/edit-coupon/:id',auth.isAdmin,(req,res)=>{

    Coupon.findById(req.params.id, (err,coupon)=>{

        if(err){
            console.log(err)
            return res.redirect('admin/404');
        }

        admin = req.session.admin;
        const error = req.flash('error');

        res.render('admin/edit-coupon',{  admin,
                                            error,
                                            id : coupon._id,
                                            coupon: coupon.coupon,
                                            offer : coupon.offer,
                                            minimum : coupon.minimum,
                                            description : coupon.description,
                                            expiry : coupon.expiry
                                        }
        );
    });
});

couponRouter.post('/edit-coupon/:id',(req,res)=>{

    let {coupon,offer,expiry,description,minimum} = req.body;
    expiry =new Date(expiry).toDateString();

    let id = req.params.id;
       
        Coupon.findOne({coupon: coupon,_id: {$ne: id}},(err,coupon)=>{
            if(err) return res.render('admin/404');
            if (coupon){

               

                req.flash('error', 'Coupon already exists!');

                return res.redirect('/admin/coupon/edit-coupon/'+id)

            }else{ 


                    Coupon.findByIdAndUpdate({_id:id},{$set:{coupon:req.body.coupon , offer:offer, expiry:expiry,description:description,minimum:minimum}})
                    .then((coupon)=>{
                        coupon.save((err)=>{

                            if(err) return console.log(err);
                            
                            
                                
                            req.flash('success', `Coupon edited successfully!`);
                            res.redirect('/admin/coupon');

                        });

                    }).catch((err)=> console.log(err));
 
            }

        });

});



couponRouter.get('/delete-coupon/:id',auth.isAdmin,(req,res)=>{

                Coupon.findById(req.params.id,(err,coupon)=>{

                        if(err) return console.log(err);

                       

                        Coupon.deleteOne(coupon,()=>{

                            req.flash('success', `Coupon deleted successfully!`);
                            res.redirect('/admin/coupon');

                        });
                        
                });

            

        });





module.exports = couponRouter 