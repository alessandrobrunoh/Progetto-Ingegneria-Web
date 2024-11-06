const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log(token);

    if (token) {
	    console.log("BRAVO");
    } else {
	    console.log("NON BRAVO");
    }
    if (!token) return res.status(401).send('Unauthorized');

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) return res.status(401).send('Error Unauthorized');
        if(!token) {
		return res.status(401).send('BOH Unauthorized');
	}
    });
};

module.exports = authenticateToken;
