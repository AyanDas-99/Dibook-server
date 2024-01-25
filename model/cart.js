const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    book_id: String,
    quantity: Number,
});

const cartSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    items: {
        type: [
            itemSchema
        ],
        required: true,
    }
})



const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;