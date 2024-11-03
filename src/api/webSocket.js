const socketIo = require('socket.io');

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: 'http://192.168.1.57:8080', // Replace with your client URL
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('joinRoom', (roomCode) => {
            socket.join(roomCode);
            console.log(`User joined room: ${roomCode}`);
        });

        socket.on('playerJoined', (roomCode, player) => {
            io.to(roomCode).emit('playerJoined', player);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};