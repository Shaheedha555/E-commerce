const express = require("express");
const orderStatusRouter = express.Router();
const Product = require("../models/productModel");
const auth = require("../config/auth");
const Address = require("../models/addressModel");
const Order = require("../models/orderModel");

orderStatusRouter.get("/", auth.isAdmin, async (req, res) => {
  let admin = req.session.admin;
  let count = await Order.count();
  let orders = await Order.find({}).populate([
    { path: "userId", model: "User" },
    {
      path: "orderDetails",
      populate: {
        path: "product",
        model: "Product",
      },
    },
  ]);
  // .sort({ date: -1 });

  let success = req.flash("success");
  let error = req.flash("error");
  let status = ["placed", "shipped", "cancelled", "delivered"];
  res.render("admin/orders", { admin, count, orders, success, error, status });
});
orderStatusRouter.post("/change-status/:id", auth.isAdmin, async (req, res) => {
  let { status } = req.body;
  let id = req.params.id;
  console.log(status, id);
  await Order.findById(id).then((order) => {
    order.status = status;
    order.save();
    res.json({ status: true });
  });
});

module.exports = orderStatusRouter;
