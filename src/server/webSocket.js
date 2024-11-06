const { Server } = require('socket.io');

function initializeWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN_CORS_IP,
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        try {
            socket.on('joinRoom', (roomCode) => {
                try {
                    console.log('User joined room:', roomCode);
                    socket.join(roomCode);
                } catch (error) {
                    console.error('Error joining room:', error);
                }
            });

            socket.on('playerJoined', (roomCode) => {
                try {
                    console.log('Player joined room:', roomCode);
                    socket.to(roomCode).emit('playerJoined'); // Use `to` to broadcast to all clients in the room except the sender
                } catch (error) {
                    console.error('Error handling playerJoined event:', error);
                }
            });

            socket.on('disconnect', () => {
                try {
                    console.log('User disconnected');
                } catch (error) {
                    console.error('Error handling disconnect event:', error);
                }
            });
        } catch (error) {
            console.error('Error during socket connection:', error);
        }
    });

    return io;
}

module.exports = initializeWebSocket;