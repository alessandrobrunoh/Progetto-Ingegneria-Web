const db = require("../utils/database.js");
const setupSocket = require("../webSocket.js");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

const initializeGame = (req, res) => {
  const roomCode = req.params.roomCode;
  console.log(req);
  console.log("Initializing game for room " + roomCode);
  // Inizializzi la stanza dicendo che il gioco è iniziato
  const sql = "UPDATE rooms SET game_started = 1 WHERE code = ?";
  db.Connection.query(sql, [roomCode], (err, result) => {
    if (err) return res.status(500).send("Error starting game");
    res.status(200).send("Game started");
  });

  
};

const drawCard = (req, res) => {};

const playCard = (req, res) => {};

const endTurn = (req, res) => {};

const endGame = (req, res) => {};

module.exports = {
  initializeGame,
  drawCard,
  playCard,
  endTurn,
  endGame,
};
