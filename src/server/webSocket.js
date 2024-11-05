const socketIo = require('socket.io');
require('dotenv').config();

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: process.env.VUE_APP_API_ORIGIN,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // TODO: Aggiungere un sistema di autenticazione per i socket
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
                io.to(roomCode).emit('playerJoined', player);
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