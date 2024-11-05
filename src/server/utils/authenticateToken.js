const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Unauthorized');

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).send('Unauthorized');
        req.user = decoded;
        next();
    });
};

module.exports = authenticateToken;