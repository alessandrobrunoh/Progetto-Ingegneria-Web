const express = require('express');
const router = express.Router();
const { initializeGame, drawCard, playCard, endTurn, endGame } = require('../controllers/gameController.js');
const authenticateToken = require('../utils/authenticateToken');

router.post( '/', authenticateToken, initializeGame );
router.post( '/draw-card', authenticateToken, drawCard );
router.post( '/play-card', authenticateToken, playCard );
router.post( '/end-turn', authenticateToken, endTurn );

module.exports = router;


