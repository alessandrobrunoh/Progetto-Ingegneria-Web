const express = require('express');
const router = express.Router();
const { getUserData } = require('../controllers/userController');
const authenticateToken = require('../utils/authenticateToken');

router.get( '/', authenticateToken, getUserData );

module.exports = router;


