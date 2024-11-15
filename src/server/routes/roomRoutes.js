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
    deleteRoom,
    addPlayerToRoom,
    removePlayerToRoom,
    updatePlayerReadyStatus
} = require('../controllers/roomController');
const authenticateToken = require('../utils/authenticateToken');

router.get('/', authenticateToken, getRooms);
router.get('/:roomCode', authenticateToken, getRoom);
router.get('/:roomCode/players', authenticateToken, getRoomPlayers);
router.get('/:roomCode/table_cards', authenticateToken, getRoomTableCards);
router.get('/:roomCode/player/:user_id/hand_cards', authenticateToken, getPlayerHandCards);
router.get('/table_cards', authenticateToken, getAllTableCards);
router.get('/players', authenticateToken, getAllPlayers);
router.post('/create', authenticateToken, createRoom);
router.delete('/:roomCode/delete', authenticateToken, deleteRoom);
router.post('/:roomCode/add-player', authenticateToken, addPlayerToRoom);
router.post('/:roomCode/remove-player', authenticateToken, removePlayerToRoom);
router.post('/:roomCode/player/:userId/ready', authenticateToken, updatePlayerReadyStatus);

module.exports = router;
