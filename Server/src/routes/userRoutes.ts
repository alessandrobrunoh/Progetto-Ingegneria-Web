import express from "express";
const router = express.Router();

import { checkAuth } from "../controllers/authController";
router.use(checkAuth);

import {
  getUser
} from "../controllers/userController";

/**
 * @route GET /user/:id
 * @description Ottiene tutti gli utenti.
 * @access Private
 */
router.get("/:id", getUser);

export default router;
