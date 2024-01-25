const express = require('express');
const Cart = require('../model/cart');
const auth = require('../middleware/auth');

const cartRoute = express.Router();

cartRoute.post("/cart/add-to-cart", auth, async (req, res) => {
    try {
        const {bookId} = req.body;
        console.log(req.body);
        let cart = await Cart.findOne({ user_id: req.user });
        if (cart == null) {
            let items = []
            cart = new Cart({ user_id: req.user, items: items });
        }
        let index = cart.items.findIndex((item) => item.book_id == bookId);
        if (index < 0) {
            cart.items.push({
                book_id: bookId,
                quantity: 1
            })
        } else {
            cart.items[index].quantity += 1;
        }

        cart = await cart.save();
        res.json(cart);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})


cartRoute.post("/cart/remove-from-cart", auth, async (req, res) => {
    try {
        const bookId = req.body.bookId;
        let cart = await Cart.findOne({ user_id: req.user });
        let index = cart.items.findIndex((item) => item.book_id == bookId);
        if(cart.items[index].quantity == 1) {
            cart.items.splice(index, 1);
        } else {
            cart.items[index].quantity -= 1;
        }
        cart = await cart.save();
        res.json(cart);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

cartRoute.post("/cart/delete-from-cart", auth, async(req, res) => {
    try {
        const bookId = req.body.bookId;
        let cart = await Cart.findOne({ user_id: req.user });
        let index = cart.items.findIndex((item) => item.book_id == bookId);
        cart.items.splice(index, 1);
        cart = await cart.save();
        res.json(cart);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

module.exports = cartRoute;