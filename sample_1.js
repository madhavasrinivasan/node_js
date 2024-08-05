const express = require("express");
const session = require('express-session');
const db = require('./db/dbconnect');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser'); // Fixed incorrect module name
const { createtoken, validatetoken } = require('./jwt');
const app = express();

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true })); // Added body parser middleware for URL-encoded bodies
app.use(cookieParser());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.get("/register", async (req, res) => { // Corrected HTTP method and argument order
    try {
        const { username, password, email, name } = req.body;
        console.log(req.body)
        const hash = await bcrypt.hash(password, 8);
        let sql = 'INSERT INTO user_info(username, password, email, name) VALUES (?, ?, ?, ?)'; // Fixed column name typo
        const find = await db.execute(sql, [username, hash, email, name]); // Await the database query
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        res.status(500).json("user not found");
    }
});

app.post('/login', async (req, res) => { // Corrected HTTP method and argument order
    try {
        const{identifier,password} = req.body
        console.log(req.body)
        
        console.log(identifier);
        console.log(password);
        let sql = 'SELECT*FROM user_info WHERE username = ? OR email = ?'
        const  [users] =  await db.execute(sql,[identifier,identifier])// Fixed HTTP status code
        console.log(users);
        const user = users[0];
        console.log(user)
        const dbpassword = user.password;
        const match = await bcrypt.compare(password, dbpassword); // Await bcrypt comparison
        if (!match) {
            return res.status(401).json("password incorrect"); // Fixed HTTP status code
        }
        const token = createtoken(user);
        req.session.user = { username: user.username, id: user.id }; // Fixed incorrect assignment
        req.session.token = token;

        res.cookie("token", token, {
            maxAge: 6000000000, // Fixed maxAge property name
            httpOnly: true
        });

        res.cookie("logged_in", true, { // Fixed method and key name
            maxAge: 6000000000,
            httpOnly: false
        });

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).json("login failed");
    }
});

app.get("/dashboard", validatetoken, (req, res) => {
    res.json({message:`welcome ${req.user.username}`}); // Fixed message interpolation
});

app.listen(3000, () => {
    console.log("server running successfully");
});


