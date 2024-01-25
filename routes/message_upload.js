const express = require('express');
const Message = require('../model/message');
const auth = require('../middleware/auth');

const messageUploadRoute = express.Router();

messageUploadRoute.post("/api/message-upload", auth, async (req, res) => {
    try {
        const { book_id, user_name, reply_to_id, message } = req.body;
        console.log(book_id, user_name, reply_to_id, message, req.user);

        let messageModel = new Message({
            book_id,
            user_id: req.user,
            user_name,
            reply_to_id,
            message,
        });

        messageModel = await messageModel.save();
        res.json(messageModel);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})


module.exports = messageUploadRoute;