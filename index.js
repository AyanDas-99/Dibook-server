const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const bookUploadRoute = require('./routes/book_upload');
const booksRoute = require('./routes/books');
const messageUploadRoute = require('./routes/message_upload');
const messagesRoute = require('./routes/messages');
const userRoute = require('./routes/user');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const salesRoute = require('./routes/sales');
var cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({ 
  cloud_name: 'drrrtwtyf', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Cloudinary config check
if (typeof (process.env.CLOUDINARY_URL) === 'undefined') {
  console.warn('!! cloudinary config is undefined !!');
  console.warn('export CLOUDINARY_URL or set dotenv file');
}


const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express()
const DB = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=AtlasApp`;

app.use(cors());
app.use(express.json());
app.use(authRoute);
app.use(bookUploadRoute);
app.use(booksRoute);
app.use(messageUploadRoute);
app.use(messagesRoute);
app.use(userRoute);
app.use(cartRoute);
app.use(orderRoute);
app.use(salesRoute);

app.get("/hello", (req, res) => {
    res.send("Unrestricted access denied");
});

// DB connection
mongoose.connect(DB).then(()=> {
    console.log('DB Connection successfull')
}).catch(e=> {
    console.log(e)
})

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Connected to port: ${PORT}`)
});