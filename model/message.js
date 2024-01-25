const mongoose = require('mongoose');

const messageSchema =new mongoose.Schema({
    book_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    reply_to_id: {
        type: String,
    },
    message: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;