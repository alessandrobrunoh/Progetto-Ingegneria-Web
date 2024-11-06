const express = require('express');
const router = express.Router();
const { getUserName } = require('../controllers/userController');
const authenticateToken = require('../utils/authenticateToken');

router.get ('/user', authenticateToken, getUserName);

module.exports = router;


