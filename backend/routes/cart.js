const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/cart
router.get('/', (req, res) => {
    const userId = req.user.id;
    const sql = `
        SELECT p.id as productId, p.name, p.price, c.qty, p.image
        FROM cart c
        JOIN products p ON c.productId = p.id
        WHERE c.userId = ?
    `;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        const total = rows.reduce((sum, item) => sum + item.price * item.qty, 0);
        res.json({ cart: rows || [], total });
    });
});

// POST /api/cart - Add or update an item
router.post('/', (req, res) => {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    if (!productId || qty === undefined) {
        return res.status(400).json({ "error": "Missing productId or qty" });
    }

    db.get("SELECT qty FROM cart WHERE userId = ? AND productId = ?", [userId, productId], (err, row) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (row) {
            // Update existing item
            const newQty = row.qty + qty;
            if (newQty <= 0) {
                // Remove if quantity is 0 or less
                db.run('DELETE FROM cart WHERE userId = ? AND productId = ?', [userId, productId], function(err) {
                    if (err) return res.status(400).json({ "error": err.message });
                    res.status(200).json({ message: 'Item removed' });
                });
            } else {
                db.run('UPDATE cart SET qty = ? WHERE userId = ? AND productId = ?', [newQty, userId, productId], function(err) {
                    if (err) return res.status(400).json({ "error": err.message });
                    res.status(200).json({ productId, qty: newQty });
                });
            }
        } else {
            // Insert new item
            if (qty > 0) {
                db.run('INSERT INTO cart (userId, productId, qty) VALUES (?, ?, ?)', [userId, productId, qty], function(err) {
                    if (err) return res.status(400).json({ "error": err.message });
                    res.status(201).json({ productId, qty });
                });
            } else {
                res.status(400).json({ "error": "Cannot add item with non-positive quantity" });
            }
        }
    });
});


// DELETE /api/cart/:id - Remove an item
router.delete('/:id', (req, res) => {
    const userId = req.user.id;
    const { id: productId } = req.params;
    db.run('DELETE FROM cart WHERE userId = ? AND productId = ?', [userId, productId], function(err) {
        if (err) {
            res.status(400).json({ "error": res.message });
            return;
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        res.json({ message: "deleted", changes: this.changes });
    });
});


module.exports = router;