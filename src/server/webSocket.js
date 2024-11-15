const { Server } = require('socket.io');

function initializeWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN_CORS_IP,
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
      socket.on('startGame', (roomCode) => {
        console.log(`Game started: ${roomCode}`);
        try {
          console.log(`Game started: ${roomCode}`);
          io.to(roomCode).emit('joinGame');
        } catch (error) {
          console.error(`Error starting game: ${error.message}`);
        }
      });
    
      socket.on('joinRoom', (roomCode) => {
        try {
          socket.join(roomCode);
          console.log(`User joined room: ${roomCode}`);
        } catch (error) {
          console.error(`Error joining room: ${error.message}`);
        }
      });
    
      socket.on('leaveRoom', (roomCode, player) => {
        try {
          socket.leave(roomCode);
          console.log(`User left room: ${roomCode}`);
          io.to(roomCode).emit('playerDisconnected', player);
        } catch (error) {
          console.error(`Error leaving room: ${error.message}`);
        }
      });
    });
    return io;
}

module.exports = initializeWebSocket;