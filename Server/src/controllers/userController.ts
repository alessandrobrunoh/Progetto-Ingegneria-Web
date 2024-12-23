import { Request, Response } from "express";
import { connect } from "../utils/database";
import { debugPrint } from "../utils/debugPrint";

/**
 * Recupera un utente dal database in base all'ID fornito nella richiesta.
 *
 * @returns Restituisce i dettagli dell'utente se trovato, altrimenti un messaggio di errore.
 *
 * @throws Restituisce un errore 404 se l'utente non viene trovato.
 * @throws Restituisce un errore 500 se si verifica un errore durante l'esecuzione della query.
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Assicurati che l'ID venga passato come parametro della richiesta
    if (!id) {
      return res.status(400).send("User ID is required");
    }

    const connection = await connect();
    const sql =
      "SELECT username, email, total_games, games_win, best_points FROM users WHERE id = ?";
    const [rows]: any = await connection.execute(sql, [id]);
    if (rows.length === 0) {
      return res.status(404).send("User not found");
    }

    debugPrint(`Sending user details as JSON response for user ID: ${id}`);
    res.json(rows[0]);
  } catch (error) {
    debugPrint("Error occurred while fetching user details");
    console.error(error);
    res.status(500).send("An error occurred");
  }
};
