const express = require('express');
const Message = require('../model/message');

const messagesRoute = express.Router();

// get messages by bookId
messagesRoute.get("/:bookId/messages", async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const limit = parseInt(req.params.limit);
        const messages =await Message.find({ book_id: bookId, reply_to_id: ""}).sort({"createdAt": -1});
        res.json(messages);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// get replies by messageId
messagesRoute.get("/:messageId/replies", async(req, res) => {
    try {
        const messageId = req.params.messageId;
        const messages = await Message.find({reply_to_id: messageId}).sort({"createdAt": 1});
        res.json(messages);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
})

module.exports = messagesRoute;