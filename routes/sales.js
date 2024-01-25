const express = require('express')
const Sale = require('../model/sale')
const auth = require('../middleware/auth')
const Book = require('../model/book')

const salesRoute = express.Router();

salesRoute.post("/sales/create-sale", auth, async (req, res) => {
    try {
        const { book_id, _id, quantity, createdAt } = req.body;
        console.log(req.body);
        let book = await Book.findById(book_id);
        
        let sale = new Sale({
            order_id: _id,
            seller_id: book.user,
            book_id: book._id,
            book_name: book.name,
            sold: quantity,
            price: book.price,
            sold_on: createdAt
        });

        sale = await sale.save();
        
        return res.json(sale);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

salesRoute.get("/sales/get-sales", auth, async(req, res) => {
    try {
        const sales = await Sale.find({seller_id: req.user}).sort({"sold_on": -1});
        res.json(sales);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});


module.exports = salesRoute;