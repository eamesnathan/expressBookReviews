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
    // Convert the books object to a JSON string
    const booksJSON = JSON.stringify(books, null, 2);
    
    // Send the JSON string as the response
    res.status(200).json(booksJSON);
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    // Find the book with the given ISBN
    const book = Object.values(books).find(book => book.isbn === isbn);
  
    if (book) {
      // Book found, send it as the response
      res.status(200).json(book);
    } else {
      // Book not found, send an error response
      res.status(404).json({ error: 'Book not found' });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    // Filter the book objects to get books by the given author
    const booksByAuthor = Object.values(books)
      .filter(book => book.author.toLowerCase() === author.toLowerCase());
  
    if (booksByAuthor.length > 0) {
      // Books found, send them as the response
      res.status(200).json(booksByAuthor);
    } else {
      // No books found, send an error response
      res.status(404).json({ error: 'No books found for the given author' });
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    // Filter the book objects to get books with the given title
    const booksByTitle = Object.values(books)
      .filter(book => book.title.toLowerCase() === title.toLowerCase());
  
    if (booksByTitle.length > 0) {
      // Books found, send them as the response
      res.status(200).json(booksByTitle);
    } else {
      // No books found, send an error response
      res.status(404).json({ error: 'No books found for the given title' });
    }
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
