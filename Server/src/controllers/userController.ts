import { Request, Response } from "express";
import { connect } from "../utils/database";
import { debugPrint } from "../utils/debugPrint";
import { getUserIdFromToken } from "../utils/getIdByToken";
import bcrypt from "bcryptjs";

export const getUserId = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send("Authorization token is required");
    }

    const user_id = getUserIdFromToken(token);
    if (!user_id) {
      return res.status(401).send("Invalid token");
    }

    debugPrint(`Sending user ID as JSON response: ${user_id}`);
    res.json(user_id);
  } catch (error) {
    debugPrint("Error occurred while fetching user ID");
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

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
      "SELECT username, email, total_games, wins, best_points, avatar, theme, cards, music, elo FROM users WHERE id = ?";
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

/**
 * Salva il profilo dell'utente autenticato.
 *
 * @param username - Il nuovo nome utente dell'utente.
 * @param email - La nuova email dell'utente.
 * @param password - La nuova password dell'utente.
 * @param avatar - Il nuovo avatar dell'utente.
 * @param theme - Il nuovo tema dell'utente.
 *
 * @remarks
 * Questa funzione aggiorna il profilo dell'utente autenticato nel database.
 * Richiede un token di autorizzazione valido nell'intestazione della richiesta.
 * Se il token è valido, aggiorna i campi `username`, `email`, `avatar` e `theme` dell'utente.
 * Se viene fornita una nuova password, questa viene aggiornata dopo essere stata hashata.
 *
 * @throws {401} Se il token di autorizzazione non è presente o non è valido.
 * @throws {400} Se uno dei campi `username`, `email`, `avatar` o `theme` non è presente nel corpo della richiesta.
 * @throws {500} Se si verifica un errore durante l'aggiornamento del profilo.
 */
export const saveProfile = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Authorization token is required");
  }

  const user_id = getUserIdFromToken(token);
  if (!user_id) {
    return res.status(401).send("Invalid token");
  }

  try {
    let { username, email, password, avatar, theme, cards, music } = req.params;
    if (!username || !email || !avatar || !theme) {
      return res.status(400).send("Username, email, avatar and theme are required");
    }

    // ? Controlla il formato dell'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Invalid email format");
    }

    const connection = await connect();

    // ? Controlla se il nome utente è già utilizzato
    const [existingUser]: any = await connection.execute(
      "SELECT id FROM users WHERE username = ? AND id != ?",
      [username, user_id]
    );
    if (existingUser.length > 0) {
      return res.status(400).send("Username is already taken");
    }

    // ? Controlla se l'email è già utilizzata
    const [existingEmail]: any = await connection.execute(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, user_id]
    );
    if (existingEmail.length > 0) {
      return res.status(400).send("Email is already taken");
    }

    if (music === "true") {
      music = 1;
    } else {
      music = 0;
    }

    const sql =
      "UPDATE users SET username = ?, email = ?, avatar = ?, theme = ?, cards = ?, music = ? WHERE id = ?";
    await connection.execute(sql, [username, email, avatar, theme, cards, music, user_id]);

    if (password !== "undefined") {
      console.log("Password: ", password);
      if (password.length < 8) {
        return res.status(400).send("Password must be at least 8 characters long");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const passwordSql = "UPDATE users SET password = ? WHERE id = ?";
      await connection.execute(passwordSql, [hashedPassword, user_id]);
    }

    debugPrint(`Profile updated successfully for user ID: ${user_id}`);
    res.send("Profile updated successfully");
  } catch (error) {
    debugPrint("Error occurred while updating profile");
    console.error("Error occurred while updating profile", error);
    res.status(500).send("An error occurred");
  }
};