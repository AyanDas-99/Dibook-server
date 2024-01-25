const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    order_id: {
        required: true,
        type: String,
    },
    seller_id: {
        required: true,
        type: String,
    },
    book_id: {
        required: true,
        type: String,
    },
    book_name: {
        required: true,
        type: String,
    },
    sold: {
        required: true,
        type: Number,
    },
    price: {
        required: true,
        type: Number,
    },
    sold_on: {
        required: true,
        type: Date,
    }
},
);


const Sale = mongoose.model("Sale", saleSchema);
module.exports = Sale