const express = require('express');
const router = express.Router();
const { login, register, checkAuth } = require('../controllers/authController');
const authenticateToken = require('../utils/authenticateToken');

router.post('/login', login);
router.post('/register', register);
router.get('/check-auth', authenticateToken, checkAuth);

module.exports = router;