const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
  
    // Check if username already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      return res.status(409).json({ error: "Username already exists" });
    }
  
    // Create a new user object
    const newUser = {
      username,
      password
    };
  
    // Add the new user to the users array
    users.push(newUser);
  
    res.status(201).json({ message: "User registered successfully" });
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books found");
        }
    })
    .then(booksData => {
        res.status(200).json(booksData);
    })
    .catch(error => {
        console.error("Error fetching book list:", error);
        res.status(500).json({ error: "Internal server error" });
    });
});


// Get book details based on ISBN using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        let book = Object.values(books).find(book => book.isbn === isbn);
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    })
    .then(bookData => {
        res.status(200).json(bookData);
    })
    .catch(error => {
        console.error("Error fetching book details:", error);
        res.status(404).json({ error: "Book not found" });
    });
});

  
// Get book details based on author using Promises with Axios
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    new Promise((resolve, reject) => {
        let booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject("No books found for the given author");
        }
    })
    .then(booksData => {
        res.status(200).json(booksData);
    })
    .catch(error => {
        console.error("Error fetching books by author:", error);
        res.status(404).json({ error: "No books found for the given author" });
    });
});


// Get book details based on title using Promises with Axios
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    new Promise((resolve, reject) => {
        let booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject("No books found for the given title");
        }
    })
    .then(booksData => {
        res.status(200).json(booksData);
    })
    .catch(error => {
        console.error("Error fetching books by title:", error);
        res.status(404).json({ error: "No books found for the given title" });
    });
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    // Find the book with the given ISBN
    const book = Object.values(books).find(book => book.isbn === isbn);
  
    if (book) {
      // Book found, send its reviews as the response
      res.status(200).json(book.reviews);
    } else {
      // Book not found, send an error response
      res.status(404).json({ error: 'Book not found' });
    }
  });

module.exports.general = public_users;
