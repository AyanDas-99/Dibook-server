const express = require("express");
const Book = require("../model/book");
const auth = require('../middleware/auth');
const CloudinaryUtils = require('../utils/cloudinary_util');

const booksRoute = express.Router();

// Get all books
booksRoute.get("/book/all-books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

// Get category based books
booksRoute.get("/book/category/:category", async (req, res) => {
    try {
        const category = req.params.category;
        const books = await Book.find({ category: category });
        res.json(books);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

// Get query based books
booksRoute.get("/book/search/:query", async (req, res) => {
    try {
        const query = req.params.query;
        const books = await Book.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(books);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

// Get book by id
booksRoute.get("/book/id/:bookId", async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const book = await Book.findById(bookId);
        res.json(book);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

// Update book
booksRoute.post("/book/update-book", auth, async (req, res) => {
    try {
        const { book } = req.body;
        const responce = await Book.updateOne({ _id: book._id, user: req.user }, book);
        if (responce.matchedCount == 0) {
            return res.status(401).json({ msg: "Not verified to update the book" });
        }
        if (!responce.acknowledged) {
            return res.status(401).json({ msg: "Couldn't update for some reason" });
        }
        res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

//  Delete book
booksRoute.post("/book/delete-book", auth, async (req, res) => {
    try {
        const bookId = req.body.bookId;
        const responce = await Book.deleteOne({ _id: bookId, user: req.user });
        if (responce.deletedCount == 0) {
            return res.status(401).json({ msg: "Not verified to update the book" });
        }
        if (!responce.acknowledged) {
            return res.status(401).json({ msg: "Couldn't update for some reason" });
        }
        res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

// Remove cloudinary assets
booksRoute.post("/book/delete-asset", auth, async (req, res) => {
    try {
        const urls = req.body.urls;
        const pids = [];
        for await (var url of urls) {
            const publicId = CloudinaryUtils.getCloudinaryPublicId(url);
            pids.push(publicId);
        }
        const response = await CloudinaryUtils.deleteFileFromCloudinary(pids);
        res.json(response);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

module.exports = booksRoute;