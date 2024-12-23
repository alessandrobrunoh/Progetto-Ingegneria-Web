import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { printLines } from "./utils/printLines";
import { logRoutes } from "./utils/logRoutes";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN_CORS_IP,
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT;

app.use(cors());

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (msg) => {
    console.log("message: " + msg);
    io.emit("message", msg); // Broadcast the message to all clients
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
    printLines(50);
  
    console.log("STATUS: Running");
    console.log(`PORT: ${PORT}`);
    console.log(`CORS: ${process.env.ORIGIN_CORS_IP}`);
    console.log("");
  
    logRoutes();
  
    printLines(50);
  });