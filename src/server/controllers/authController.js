const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../utils/database');
require('dotenv').config();

const secretKey = "your_secret_key";
const tokenExpiry = '10s';

const login = (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.Connection.query(sql, [username], async (err, result) => {
        if (err) return res.status(500).send('Error in query');
        if (result.length === 0) return res.status(401).send('Username or password is incorrect');

        const isPasswordValid = await bcrypt.compare(password, result[0].password);
        if (!isPasswordValid) return res.status(401).send('Username or password is incorrect');

        const userId = result[0].id;
        const token = jwt.sign({ id: userId, username: result[0].username }, secretKey, { expiresIn: tokenExpiry });

        res.json({ token });
    });
};

const register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.Connection.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).send('Error inserting data');
        res.send('Data inserted successfully');
    });
};

const checkAuth = (req, res) => {
    res.json({ isAuthenticated: true, user: req.user });
};

module.exports = { login, register, checkAuth };