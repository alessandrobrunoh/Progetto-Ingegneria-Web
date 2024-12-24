import express from "express";
import { isPlayerInGame } from "../controllers/playerController";

/**
 * Questo modulo gestisce le richieste relative all'autenticazione.
 */
const router = express.Router();

/**
 * @method GET
 * @route /in_game
 * @description Controlla se il giocatore è in partita.
 */
router.get("/in_game", isPlayerInGame);

export default router;
