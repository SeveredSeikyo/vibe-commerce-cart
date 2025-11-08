const express = require('express');
const router = express.Router();
const db = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-super-secret-key-that-should-be-in-env-vars'; // In a real app, use environment variables

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (err || !result) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            
            // Passwords match, create JWT
            const payload = { id: user.id, username: user.username };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

            res.json({
                message: "Logged in successfully",
                token: token,
                user: { id: user.id, username: user.username }
            });
        });
    });
});

module.exports = router;
