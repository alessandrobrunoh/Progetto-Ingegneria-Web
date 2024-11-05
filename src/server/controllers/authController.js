const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../utils/database');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';
const tokenExpiry = '10s';
const refreshTokenExpiry = '20s';

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
        const refreshToken = jwt.sign({ id: userId, username: result[0].username }, refreshTokenSecret, { expiresIn: refreshTokenExpiry });

        const insertRefreshTokenSql = 'INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)';
        db.Connection.query(insertRefreshTokenSql, [userId, refreshToken], (err) => {
            if (err) return res.status(500).send('Error storing refresh token');
            res.json({ token, refreshToken });
        });
    });
};

const refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).send('Refresh token is required');

    const sql = 'SELECT * FROM refresh_tokens WHERE token = ?';
    db.Connection.query(sql, [refreshToken], (err, result) => {
        if (err) return res.status(500).send('Error in query');
        if (result.length === 0) return res.status(401).send('Invalid refresh token');

        jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
            if (err) return res.status(401).send('Invalid refresh token');

            const newToken = jwt.sign({ id: decoded.id, username: decoded.username }, secretKey, { expiresIn: tokenExpiry });
            res.json({ token: newToken });
        });
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

module.exports = { login, refreshToken, register, checkAuth };