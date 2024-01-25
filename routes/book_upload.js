const express = require("express");
const auth = require("../middleware/auth");
const Book = require("../model/book");

const bookUploadRoute = express.Router();

bookUploadRoute.post("/user/upload", auth, async (req, res) => {
    try {
        const { name, description, category, mrp, price, stock, images, rating, front_rating, back_rating, markings_rating, binding_rating} = req.body;
        console.log(name, description, category, mrp, price, stock, images, rating);
        let book = new Book({
            name,
            description,
            category,
            mrp,
            price,
            stock,
            images,
            rating,
            front_rating,
            back_rating,
            markings_rating,
            binding_rating,
            user: req.user,
        });

        book = await book.save();
        res.json(book);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = bookUploadRoute