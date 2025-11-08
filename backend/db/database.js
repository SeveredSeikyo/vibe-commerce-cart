const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const axios = require('axios');

const dbPath = path.resolve(__dirname, 'commerce.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the commerce.db SQlite database.');
});

const seedProducts = async () => {
    try {
        const { data: productsFromApi } = await axios.get('https://fakestoreapi.com/products?limit=12');
        const stmt = db.prepare("INSERT OR IGNORE INTO products (id, name, price, image, description) VALUES (?, ?, ?, ?, ?)");
        productsFromApi.forEach(p => {
            stmt.run(p.id, p.title, p.price, p.image, p.description);
        });
        stmt.finalize();
        console.log("Products table seeded from Fake Store API.");
    } catch (error) {
        console.error("Failed to seed products from Fake Store API:", error.message);
    }
};

db.serialize(() => {
    // Create Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT,
        description TEXT
    )`, (err) => {
        if (err) return console.error("Error creating products table", err.message);
        
        db.get("SELECT count(*) as count FROM products", (err, row) => {
            if (row.count === 0) {
                seedProducts();
            } else {
                console.log("Products table already populated.");
            }
        });
    });

    // Create Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
    )`, (err) => {
        if (err) return console.error("Error creating users table", err.message);
        
        // Seed mock user
        const mockUsername = "test";
        const mockPassword = "test123";
        db.get("SELECT * FROM users WHERE username = ?", [mockUsername], (err, row) => {
            if (!row) {
                bcrypt.hash(mockPassword, 10, (err, hash) => {
                    if (err) return console.error("Error hashing password", err);
                    db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [mockUsername, hash], (err) => {
                        if (err) return console.error("Error seeding mock user", err.message);
                        console.log("Mock user 'test' created.");
                    });
                });
            }
        });
    });

    // Create Cart Table
    db.run(`CREATE TABLE IF NOT EXISTS cart (
        userId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        qty INTEGER NOT NULL,
        PRIMARY KEY (userId, productId),
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id)
    )`, (err) => {
        if (err) return console.error("Error creating cart table", err.message);
        console.log("Cart table created.");
    });
});

module.exports = db;