const socketIo = require('socket.io');;
const db = require('./utils/database'); // Assuming you have a database utility
require('dotenv').config();

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
		origin: process.env.ORIGIN_CORS_IP,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Function to handle MySQL errors and emit them through the socket
    const handleMySqlError = (socket, error) => {
        console.error(`MySQL Error: ${error.message}`);
        socket.emit('mysqlError', 'A database error occurred');
    };

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('joinRoom', (roomCode) => {
            try {
                socket.join(roomCode);
                console.log(`User joined room: ${roomCode}`);
            } catch (error) {
                console.error(`Error joining room: ${error.message}`);
                socket.emit('error', 'Error joining room');
            }
        });

        socket.on('playerJoined', (roomCode, player) => {
            try {
                // Example MySQL query
                const sql = 'INSERT INTO players (room_code, player_name) VALUES (?, ?)';
                db.Connection.query(sql, [roomCode, player.name], (err) => {
                    if (err) return handleMySqlError(socket, err);
                    io.to(roomCode).emit('playerJoined', player);
                });
            } catch (error) {
                console.error(`Error emitting playerJoined: ${error.message}`);
                socket.emit('error', 'Error emitting playerJoined');
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};
