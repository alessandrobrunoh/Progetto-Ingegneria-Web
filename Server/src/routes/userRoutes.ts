import express from "express";
import { checkAuth } from "../controllers/authController";
import { getUser } from "../controllers/userController";

/**
 * Questo modulo gestisce le richieste relative agli utenti.
 */
const router = express.Router();

router.use(checkAuth);

router.get("/:id", getUser);

export default router;