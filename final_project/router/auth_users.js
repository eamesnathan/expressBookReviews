const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "username": "testuser2",
        "password": "testpassword2"
    }
    
  ];

const isValid = (username) => {
  // Check if the username exists in the users array
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Find the user with the given username
  const user = users.find(user => user.username === username);

  // Check if the user exists and the password matches
  return user && user.password === password;
};

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // Check if the user is authenticated
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Generate a JWT token
  const secret = 'your_secret_key'; // Replace with your secret key
  const token = jwt.sign({ username }, secret, { expiresIn: '1h' });

  res.status(200).json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;