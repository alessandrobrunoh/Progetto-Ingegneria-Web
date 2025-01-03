import { Server } from "socket.io";

export const initializeWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN_CORS_IP,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");
    
    socket.on("joinRoom", (room, player) => {
      socket.join(room);
      socket.to(room).emit("playerJoined", player);
      console.log(`Player ${player} joined room ${room}`);
    });
    
    socket.on("leaveRoom", (room, player) => {
      socket.to(room).emit("playerLeft", player);
      socket.leave(room);
    });

    socket.on("hostLeft", (room) => {
      socket.to(room).emit("hostDelete");
      socket.leave(room);
    });
    
    socket.on("startGame", (room) => {
      socket.to(room).emit("gameStarted");
    });

    socket.on("joinGame", (game) => {
      socket.join(game);
      console.log(`Player joined game ${game}`);
    });

    socket.on("passTurn", (game, player) => {
      socket.to(game).emit("turnPassed", player);
      console.log(`Player ${player} passed turn in game ${game}`);
    });

    socket.on("playCard", (game, player) => {
      socket.to(game).emit("cardPlayed", player);
      console.log(`Player ${player} played card in game ${game}`);
    });

    socket.on("leaveGame", (game) => {
      console.log(`Player left game ${game}`);
      socket.to(game).emit("playerLeftGame");
      socket.leave(game);
    });

    socket.on("lastRound", (game) => {
      socket.to(game).emit("lastRoundStarted");
    });
    
    socket.on("endGame", (game) => {
      socket.to(game).emit("gameEnded");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

  });

  return io;
};