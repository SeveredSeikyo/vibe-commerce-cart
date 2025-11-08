const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

// POST /api/checkout
router.post('/', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ "error": "Cart is empty" });
    }

    const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    
    // Clear the user's cart in the database
    db.run('DELETE FROM cart WHERE userId = ?', [userId], function(err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        // Respond with a receipt
        res.json({
            receiptId: `RCPT-${Date.now()}`,
            total: total,
            timestamp: new Date().toISOString(),
            items: cartItems
        });
    });
});

module.exports = router;