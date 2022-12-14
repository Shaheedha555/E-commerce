const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const config = require("./config/database");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookie = require("cookie-parser");
const flash = require("connect-flash");
const nocache = require("nocache");
const userRouter = require("./routes/user-router");
const adminRouter = require("./routes/admin-router");
const categoryRouter = require("./routes/category-router");
const couponRouter = require("./routes/coupon-router");
const productRouter = require("./routes/product-router");
const profileRouter = require("./routes/profile-router");
const userProductRouter = require("./routes/user-product-router");
const cartRouter = require("./routes/cart-router");
const wishlistRouter = require("./routes/wishlist-router");
const orderRouter = require("./routes/order-router");
const Wishlist = require("./models/wishlistModel");
const Cart = require("./models/cartModel");
const orderStatusRouter = require("./routes/order-status-router");

mongoose
  .connect(config.database)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("Database connection failed" + err);
  });

app.set("view engine", "ejs");

app.use(nocache());
app.use(cookie("cookieSecret"));
app.use(
  session({
    secret: "sessionSecret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 1000 * 60, secure: false },
  })
);

app.use("/views", express.static(path.join(__dirname, "views")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(flash());

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/admin/category", categoryRouter);
app.use("/admin/product", productRouter);
app.use("/admin/orders", orderStatusRouter);
app.use("/admin/coupon", couponRouter);
app.use("/profile", profileRouter);
app.use("/products", userProductRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
app.use("/orders", orderRouter);

app.get("/admin/*", (req, res) => {
  let admin = req.session.admin;
  res.render("admin/404", { admin });
});
app.get("*", async (req, res) => {
  let user = req.session.user;
  let count = null;
  if (user) {
    const cartItems = await Cart.findOne({ userId: user._id });

    if (cartItems) {
      count = cartItems.cart.length;
    }
  }
  let wishcount = null;

  if (user) {
    const wishlistItems = await Wishlist.findOne({ userId: user._id });

    if (wishlistItems) {
      wishcount = wishlistItems.wishlist.length;
    }
  }
  res.render("user/404", { user, count, wishcount });
});
app.listen(port, () => {
  console.log(`Listening to the server on http://localhost:${port}`);
});
