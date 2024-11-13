const express = require('express');
const router = express.Router();
const {updateUsername, updatePassword, updateEmail, updateAvatar, saveProfile} = require('../controllers/profileController');
const authenticateToken = require('../utils/authenticateToken');

router.post ('/update-username', authenticateToken, updateUsername);
router.post('/update-password', authenticateToken, updatePassword);
router.post('/update-email', authenticateToken, updateEmail);
router.post('/update-avatar', authenticateToken, updateAvatar);
router.post('/save-profile', authenticateToken, saveProfile);

module.exports = router;


