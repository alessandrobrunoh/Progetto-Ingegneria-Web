import express from "express";
const router = express.Router();

import { checkAuth } from "../controllers/authController";
router.use(checkAuth);

import { getUser, getUserId } from "../controllers/userController";

/**
 * @route GET /user
 * @description Ottiene l'ID dell'utente.
 * @access Private
 */
router.get("/", getUserId);

/**
 * @route GET /user/:id
 * @description Ottiene le informazioni di un utente specifico tramite USER_ID.
 * @access Private
 */
router.get("/:id", getUser);

export default router;
