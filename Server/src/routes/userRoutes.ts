import express from "express";
const router = express.Router();

import { checkAuth } from "../controllers/authController";
router.use(checkAuth);

import { getUser, getUserId, saveProfile } from "../controllers/userController";

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

/**
 * @route POST /user/profile/:username/:email/:password/:theme/:avatar
 * @description Salva il profilo dell'utente.
 * @access Private
 */
router.post("/profile/:username/:email/:password/:theme/:avatar/:cards/:music/save", saveProfile);

export default router;
