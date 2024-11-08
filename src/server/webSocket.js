const { Server } = require('socket.io');

function initializeWebSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN_CORS_IP,
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
      console.log('A user connected');
      socket.join('lobby');

      socket.on('updateTeams', (roomCode) => {
        io.to(roomCode).emit('updateTeams');
      });

      socket.on('updateReady', (roomCode) => {
        io.to(roomCode).emit('updateReady');
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
    
      socket.on('disconnect', () => {
        try {
          console.log('A user disconnected');
        } catch (error) {
          console.error(`Error during disconnect: ${error.message}`);
        }
      });
    });
    return io;
}

module.exports = initializeWebSocket;