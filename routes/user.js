const express = require('express');
const auth = require('../middleware/auth');
const userRoute = express.Router();
const User = require('../model/user');
const Cart = require('../model/cart');
const Order = require('../model/order');
const Book = require('../model/book');

// statusCode 200 if updated
userRoute.post("/user/update-user", auth, async (req, res) => {
    try {
        const { address, photo_url, name } = req.body;
        let user = await User.findByIdAndUpdate(req.user, { address: address, photo_url, name });
        res.json(user);
    } catch (e) {
        res.status(500).json({ "error": e.message });
    }
})


// get cart from user
userRoute.get("/user/cart", auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user_id: req.user });
        res.json(cart);
    } catch (e) {
        res.status(500).json({ "error": e.message });
    }
})

// get orders from user
userRoute.get("/user/orders", auth, async (req, res) => {
    try {
        let orders = await Order.find({ user_id: req.user }).sort({ "createdAt": -1 });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ "error": e.message });
    }
})

// get books on sale
userRoute.get("/user/books-on-sale", auth, async (req, res) => {
    try {
        let books = await Book.find({ user: req.user });
        res.json(books);
    } catch (e) {
        res.status(500).json({ "error": e.message });
    }

})


module.exports = userRoute;