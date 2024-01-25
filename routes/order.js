const express = require('express');
const Order = require('../model/order');
const Book = require('../model/book');
const auth = require('../middleware/auth');
const ReceiptTemplate = require('../model/receipt_template');
const CloudinaryUtils = require('../utils/cloudinary_util')


const orderRoute = express.Router();

orderRoute.post("/order/place-order", auth, async (req, res) => {
    try {
        const { bookId, quantity, address, status } = req.body;
        console.log(req.body);

        let book = await Book.findById(bookId);

        if (book.stock == 0) {
            return res.status(409).json({ error: "Book not available" });
        } else if (quantity > book.stock) {
            return res.status(409).json({ error: "Order quantity is more than stock left" });
        }

        book.stock -= quantity;

        let order = new Order({
            user_id: req.user,
            book_id: bookId,
            quantity: quantity,
            address: address,
            status: status 
        });

        order = await order.save();
        book = await book.save();

        return res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})


orderRoute.post("/order/cancel-order", auth, async (req, res) => {
    try {
        const orderId = req.body.orderId;
        await Order.findByIdAndDelete(orderId);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

orderRoute.post("/order/get-order-receipt", auth, async (req, res) => {
    try {
        const orderIds = req.body.orders;
        const paymentMethod = req.body.paymentMethod
        // orders = [
        // [Order, Book],
        // [Order, Book],
        // ]
        const orders = [];
        for (const orderId of orderIds) {
            let orderItem = await Order.findById(orderId);
            let book = await Book.findById(orderItem.book_id);
            orders.push([orderItem, book]);
        }


        // Generate pdf
        const doc = await ReceiptTemplate.createPdf(orders, req.user, paymentMethod);
        const link = await CloudinaryUtils.uploadFileToCloudinary(doc);
        res.json(link);
        
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

})

module.exports = orderRoute;