const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const getUserName = (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized');
        }
        res.json({ id: decoded.id, username: decoded.username }); // Assuming the token contains the user ID and username
    });
}

module.exports = { getUserName };