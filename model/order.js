const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: String,
    book_id: String,
    quantity: Number,
    address: String,
    status: String,
},
    {
        timestamps: true
    },
);


const Order = mongoose.model("Order", orderSchema);
module.exports = Order;