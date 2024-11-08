const express = require('express');
const router = express.Router();
const {updateUsername, updatePassword, updateEmail, updateAvatar, saveProfile} = require('../controllers/profileController');
const authenticateToken = require('../utils/authenticateToken');

router.post ('/user/update-username', authenticateToken, updateUsername);
router.post('/user/update-password', authenticateToken, updatePassword);
router.post('/user/update-email', authenticateToken, updateEmail);
router.post('/user/update-avatar', authenticateToken, updateAvatar);
router.post('/user/save-profile', authenticateToken, saveProfile);

module.exports = router;


