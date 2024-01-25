const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth");

const authRoute = express.Router();


authRoute.post("/api/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingEmails = await User.findOne({ email });
        if (existingEmails) {
            return res.status(400).json({
                msg: "User with the same email already exists"
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 8);
        let user = new User({
            name,
            email,
            password: encryptedPassword,
        });
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

authRoute.post("/api/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: "User with this email does not exist"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                msg: "Incorrect password"
            });
        }

        const token = jwt.sign({ id: user._id }, "passwordKey");
        console.log(user._doc)
        res.json({
            token,
            ...user._doc,
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
})

authRoute.post("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(400).json({
                msg: "User not found"
            });
        }

        res.json({
            token: req.token,
            ...user._doc
        })

    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
})

module.exports = authRoute;