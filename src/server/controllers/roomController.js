const db = require('../utils/database');
const setupSocket = require("../webSocket.js");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

const getRooms = (req, res) => {
    const sql = 'SELECT * FROM rooms';
    db.Connection.query(sql, (err, result) => {
        if (err) return res.status(500).send('Error in query');
        res.json(result);
    });
};

const getRoom = (req, res) => {
    const sql = 'SELECT * FROM rooms WHERE code = ?';
    db.Connection.query(sql, [req.params.code], (err, result) => {
        if (err) return res.status(500).send('Error in query');
        res.json(result);
    });
};

const getRoomPlayers = (req, res) => {
    const sql = `
        SELECT players.*, users.username AS name
        FROM players
        JOIN users ON players.user_id = users.id
        WHERE players.ROOM_code = ?
    `;
    db.Connection.query(sql, [req.params.code], (err, result) => {
        if (err) return res.status(500).send('Error in query');
        res.json(result);
    });
};

const getRoomTableCards = (req, res) => {
    const sql = 'SELECT * FROM table_cards WHERE PLAYERS_GAMES_code = ?';
    db.Connection.query(sql, [req.params.code], (err, result) => {
        if (err) return res.status(500).send('Error in query');
        res.json(result);
    });
};

const getPlayerHandCards = (req, res) => {
    const sql = 'SELECT number_card_1, seed_card_1, number_card_2, seed_card_2, number_card_3, seed_card_3 FROM hand_cards WHERE PLAYER_GAME_code = ? AND PLAYER_USER_id = ?';
    db.Connection.query(sql, [req.params.code, req.params.user_id], (err, result) => {
        if (err) return res.status(500).send('Error in query');
        res.json(result);
    });
};

const getAllTableCards = (req, res) => {
    const sql = 'SELECT * FROM table_cards';
    db.Connection.query(sql, (err, result) => {
        if (err) return res.status(500).send('Error in query');
        res.json(result);
    });
};

const getAllPlayers = (req, res) => {
    const sql = 'SELECT * FROM players';
    db.Connection.query(sql, (err, result) => {
        if (err) return res.status(500).send('Error in query');
        res.json(result);
    });
};

const generateRoomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomCode = '';
    for (let i = 0; i < 8; i++) {
        roomCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return roomCode;
};

const isRoomCodeUnique = async (roomCode) => {
    return new Promise((resolve, reject) => {
        const checkRoomCodeSql = 'SELECT COUNT(*) AS count FROM rooms WHERE code = ?';
        db.Connection.query(checkRoomCodeSql, [roomCode], (err, result) => {
            if (err) return reject(err);
            resolve(result[0].count === 0);
        });
    });
};

const createRoom = async (req, res) => {
    const userId = req.user.id;
    let roomCode;
    let isUnique = false;

    while (!isUnique) {
        roomCode = generateRoomCode();
        try {
            isUnique = await isRoomCodeUnique(roomCode);
        } catch (error) {
            return res.status(500).send('Error creating room');
        }
    }

    const createRoomSql = 'INSERT INTO rooms (code, PLAYER_TURN_ID) VALUES (?, ?)';
    db.Connection.query(createRoomSql, [roomCode, userId], (err, result) => {
        if (err) return res.status(500).send('Error creating room');
        const addUserSql = 'INSERT INTO players (ROOM_code, user_id, team, host) VALUES (?, ?, 1, true)';
        db.Connection.query(addUserSql, [roomCode, userId], (err, result) => {
            if (err) return res.status(500).send('Error adding user to room');
            res.json({ roomCode });
        });
    });
};

const addPlayerToRoom = async (req, res) => {
    const userId = req.user.id;
    const roomCode = req.params.roomCode;
    const io = req.io;

    const getTeamsSql = `
        SELECT SUM(IF(team = 1, 1, 0)) AS team1Count,
               SUM(IF(team = 2, 1, 0)) AS team2Count
        FROM players
        WHERE ROOM_code = ?
    `;
    db.Connection.query(getTeamsSql, [roomCode], (err, result) => {
        if (err) return res.status(500).send('Error fetching team counts');

        const team1Count = result[0].team1Count || 0;
        const team2Count = result[0].team2Count || 0;
        const team = team1Count <= team2Count ? 1 : 2;

        const addUserSql = 'INSERT INTO players (ROOM_code, user_id, team) VALUES (?, ?, ?)';
        db.Connection.query(addUserSql, [roomCode, userId, team], (err, result) => {
            if (err) return res.status(500).send('Error adding user to room');
            const player = { user_id: userId, name: req.user.username, team };
            io.to(roomCode).emit('playerJoined', player);
            res.status(200).send('User added to room');
        });
    });
};

const removePlayerToRoom = async (req, res) => {
    const userId = req.user.id;
    const roomCode = req.params.roomCode;
    const io = req.io;
    const removeUserSql = 'DELETE FROM players WHERE ROOM_code = ? AND user_id = ?';
    db.Connection.query(removeUserSql, [roomCode, userId], (err, result) => {
        if (err) return res.status(500).send('Error removing user from room');
        io.to(roomCode).emit('playerDisconnected', userId);
        res.status(200).send('User removed from room');
    });
}

const updatePlayerReadyStatus = (req, res) => {
    const { roomCode, userId } = req.params;
    const ready = req.body.ready ? 1 : 0;
    const sql = 'UPDATE players SET ready = ? WHERE ROOM_code = ? AND user_id = ?';
    db.Connection.query(sql, [ready, roomCode, userId], (err, result) => {
        if (err) return res.status(500).send('Error updating player ready status');
        res.status(200).send('Player ready status updated');
    });
};

const getRoomStatus = (req, res) => {
    const roomCode = req.params.roomCode;
    const sql = 'SELECT COUNT(*) AS count FROM players WHERE ROOM_code = ? AND ready = 1';
    db.Connection.query(sql, [roomCode], (err, result) => {
        if (err) return res.status(500).send('Error fetching room status');
        res.json(result[0]);
    });
};

module.exports = {
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
    updatePlayerReadyStatus,
    getRoomStatus
};
