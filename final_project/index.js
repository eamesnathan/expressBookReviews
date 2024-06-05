const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log("No authorization header");
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log("No token found in authorization header");
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Token decoded successfully:", decoded);
        req.user = decoded;
        next();
    } catch (ex) {
        console.log("Token verification failed:", ex.message);
        return res.status(400).json({ message: "Invalid token." });
    }
});

 
const PORT =5000;

app.use("/customer", customer_routes);

app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
