import express from "express";
import { login, register, checkAuth, logout } from "../controllers/authController";

/**
 * Questo modulo gestisce le richieste relative all'autenticazione.
 */
const router = express.Router();

/**
 * @method POST
 * @route /login
 * @description Effettua il login.
 * @access Public
 */
router.post("/login", login);

/**
 * @method POST
 * @route /register
 * @description Registra un nuovo utente.
 * @access Public
 */
router.post("/register", register);

/**
 * @method GET
 * @route /logout
 * @description Controlla se l'utente è autenticato.
 * @access Private
 */
router.get("/logout", logout);

/**
 * @method GET
 * @route /checkauth
 * @description Controlla se l'utente è autenticato.
 * @access Private
 */
router.get("/checkauth", checkAuth);

export default router;
