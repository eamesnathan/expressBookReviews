const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: 'testuser', password: 'testpassword' }
];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username);
    return user && user.password === password;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    const secret = 'your_secret_key'; // Replace with your secret key
    const token = jwt.sign({ username }, secret, { expiresIn: '1h' });

    req.session.username = username;

    res.status(200).json({ token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    try {
        console.log("PUT /auth/review/:isbn called");
        console.log("Received request body:", req.body);
        const isbn = req.params.isbn;
        console.log("ISBN:", isbn);
        const { review } = req.body;
        const username = req.session.username;
        console.log("Username from session:", username);

        if (!isbn || !review) {
            return res.status(400).json({ message: "ISBN and review are required" });
        }

        if (!username) {
            return res.status(401).json({ message: "You must be logged in to post a review" });
        }

        let book = Object.values(books).find(book => book.isbn === isbn);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        book.reviews = book.reviews || {};
        book.reviews[username] = review;
        console.log("Review added/updated successfully");

        return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    try {
        console.log("DELETE /auth/review/:isbn called");
        const isbn = req.params.isbn;
        console.log("ISBN:", isbn);
        const username = req.session.username;
        console.log("Username from session:", username);

        if (!isbn) {
            console.log("ISBN missing");
            return res.status(400).json({ message: "ISBN is required" });
        }

        if (!username) {
            console.log("Username not found in session");
            return res.status(401).json({ message: "You must be logged in to delete a review" });
        }

        let book = Object.values(books).find(book => book.isbn === isbn);
        if (!book) {
            console.log("Book not found");
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.reviews && book.reviews[username]) {
            delete book.reviews[username];
            console.log("Review deleted successfully");
            return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
        } else {
            console.log("Review by user not found");
            return res.status(404).json({ message: "Review by user not found" });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
