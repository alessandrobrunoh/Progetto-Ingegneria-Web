const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../utils/database');

const secretKey = process.env.SECRET_KEY;
const tokenExpire = process.env.TOKEN_EXPIRE;

const login = (req, res) => {
    const { username, password, email, avatar } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.Connection.query(sql, [username], async (err, result) => {
        if (err) return res.status(500).send('Error in query');
        if (result.length === 0) return res.status(401).send('Username or password is incorrect');

        const isPasswordValid = await bcrypt.compare(password, result[0].password);
        if (!isPasswordValid) return res.status(401).send('Username or password is incorrect');

        const token = jwt.sign({ id: result[0].id, username: result[0].username, email: result[0].email, avatar: result[0].avatar }, secretKey, { expiresIn: tokenExpire });
        res.json({ token });
    });
};

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.Connection.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Error inserting data');
            }
            console.log('Data inserted successfully');
            res.send('Data inserted successfully');
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Error during registration');
    }
};

const checkAuth = (req, res) => {
    res.json({ isAuthenticated: true, user: req.user });
};

module.exports = { login, register, checkAuth };