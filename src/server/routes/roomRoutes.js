const express = require('express');
const router = express.Router();
const {
    getRooms,
    getRoom,
    getRoomPlayers,
    getRoomTableCards,
    getPlayerHandCards,
    getAllTableCards,
    getAllPlayers,
    createRoom,
    addPlayerToRoom,
    removePlayerToRoom,
    updatePlayerReadyStatus
} = require('../controllers/roomController');
const authenticateToken = require('../utils/authenticateToken');

router.get('/rooms', authenticateToken, getRooms);
router.get('/room/:code', authenticateToken, getRoom);
router.get('/room/:code/players', authenticateToken, getRoomPlayers);
router.get('/room/:code/table_cards', authenticateToken, getRoomTableCards);
router.get('/room/:code/player/:user_id/hand_cards', authenticateToken, getPlayerHandCards);
router.get('/rooms/table_cards', authenticateToken, getAllTableCards);
router.get('/rooms/players', authenticateToken, getAllPlayers);
router.post('/room/create', authenticateToken, createRoom);
router.post('/room/:roomCode/add-player', authenticateToken, addPlayerToRoom);
router.post('/room/:roomCode/remove-player', authenticateToken, removePlayerToRoom);
router.post('/room/:roomCode/player/:userId/ready', authenticateToken, updatePlayerReadyStatus);

module.exports = router;
