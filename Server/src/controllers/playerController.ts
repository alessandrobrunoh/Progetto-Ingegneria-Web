import { Request, Response } from "express";
import { connect } from "../utils/database";
import { getUserIdFromToken } from "../utils/getIdByToken";
import { debugPrint } from "../utils/debugPrint";

export const isPlayerInGame = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Authorization token is missing");
  }

  const user_id = getUserIdFromToken(token);
  if (!user_id) {
    return res.status(401).send("Invalid or expired token");
  }

  try {
    const connection = await connect();
    const sql = "SELECT room_code FROM players WHERE user_id = ? AND in_game = 1 AND gave_up = 0";
    const [rows]: any = await connection.execute(sql, [user_id]);

    return res.json(rows);
  } catch (error) {
    debugPrint("Error in isPlayerInGame: ");
    console.error(error);
    return res.status(500).send("An error occurred");
  }
};
