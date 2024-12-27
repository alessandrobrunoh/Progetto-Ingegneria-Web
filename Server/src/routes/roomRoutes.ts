import express from "express";
const router = express.Router();

import { checkAuth } from "../controllers/authController";
import {
  getRooms,
  getRoom,
  getRoomPlayers,
  getPlayerInRoom,
  getPlayerIsHost,
  getRoomTableCards,
  getPlayerHand,
  createRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
  startGame,
  endGame,
  playCard,
  passTurn,
  drawCard,
  giveUp,
} from "../controllers/roomController";

router.use(checkAuth);

/**
 * @route GET /rooms
 * @description Ottiene tutte le stanze.
 * @access Private
 */
router.get("/browse", getRooms);

/**
 * @route GET /rooms/:code
 * @description Ottiene le informazioni di base di una stanza specifica tramite ROOM_ID.
 * @access Private
 */
router.get("/:code", getRoom);

/**
 * @route GET /rooms/:code/players
 * @description Ottiene tutti i giocatori in una stanza specifica tramite ROOM_ID.
 * @access Private
 */
router.get("/:code/players", getRoomPlayers);

/**
 * @route GET /rooms/:code/player/in_room
 * @description Ottiene le informazioni di un giocatore specifico in una stanza specifica tramite ROOM_ID e PLAYER_ID.
 * @access Private
 */
router.get("/:code/player/in_room", getPlayerInRoom);

/**
 * @route GET /rooms/:code/player/:player_id/is_host
 * @description Ottiene se un giocatore è l'host di una stanza specifica tramite ROOM_ID e PLAYER_ID.
 * @access Private
 */
router.get("/:code/player/is_host", getPlayerIsHost);

/**
 * @route GET /rooms/:code/table-cards
 * @description Ottiene le carte sul tavolo in una stanza specifica tramite ROOM_ID.
 * @access Private
 */
router.get("/:code/table", getRoomTableCards);

/**
 * @route GET /rooms/:code/players/:player_id/hand
 * @description Ottiene la mano di un giocatore specifico in una stanza specifica tramite ROOM_ID e PLAYER_ID.
 * @access Private
 */
router.get("/:code/player/:player_id/hand", getPlayerHand);

/**
 * @route POST /rooms/create
 * @description Crea una nuova stanza.
 * @access Private
 */
router.post("/create", createRoom);

/**
 * @route POST /rooms/delete
 * @description Elimina una stanza.
 * @access Private
 */
router.delete("/:code/delete", deleteRoom);

/**
 * @route POST /rooms/:code/join
 * @description Permette di unirsi a una stanza specifica tramite ROOM_ID.
 * @access Private
 */
router.post("/:code/join", joinRoom);

/**
 * @route POST /rooms/:code/leave
 * @description Permette di lasciare una stanza specifica tramite ROOM_ID.
 * @access Private
 */
router.delete("/:code/leave", leaveRoom);

/**
 * @route POST /rooms/:code/start
 * @description Avvia una partita in una stanza specifica tramite ROOM_ID.
 * @access Private
 */
router.post("/:code/start", startGame);

/**
 * @route POST /rooms/:code/end
 * @description Termina una partita in una stanza specifica tramite ROOM_ID.
 * @access Private
 */
router.post("/:code/end", endGame);

/**
 * @route POST /rooms/:code/players/:player_id/play/:card_id
 * @description Permette a un giocatore di giocare una carta in una stanza specifica tramite ROOM_ID e PLAYER_ID.
 * @access Private
 */
router.post("/:code/player/play/:number/:seed", playCard);

/**
 * @route POST /rooms/:code/players/:player_id/pass
 * @description Permette a un giocatore di passare il turno in una stanza specifica tramite ROOM_ID e PLAYER_ID.
 * @access Private
 */
router.post("/:code/player/pass", passTurn);

/**
 * @route POST /rooms/:code/players/:player_id/draw
 * @description Permette a un giocatore di pescare una carta in una stanza specifica tramite ROOM_ID e PLAYER_ID.
 * @access Private
 */
router.post("/:code/player/draw", drawCard);

/**
 * @route POST /rooms/:code/player/give_up
 * @description Permette a un giocatore di abbandonare la partita in una stanza specifica tramite ROOM_ID.
 * @access Private
 */
router.post("/:code/player/give_up", giveUp);

export default router;
