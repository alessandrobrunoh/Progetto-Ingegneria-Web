const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied. No token provided.');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send('Token expired');
            }
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;