import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connect } from "../utils/database";
import { getUserIdFromToken } from "../utils/getIdByToken";

const invalidatedTokens: string[] = [];

/**
 * Gestisce il login dell'utente validando le credenziali e generando un token JWT.
 *
 * @param username - Il nome utente dell'utente.
 * @param password - La password dell'utente.
 *
 * @returns Un oggetto JSON contenente il token JWT se il login ha successo.
 *
 * @throws Invierà uno stato 400 se username o password sono mancanti.
 * @throws Invierà uno stato 404 se l'utente non viene trovato.
 * @throws Invierà uno stato 401 se la password non corrisponde.
 * @throws Invierà uno stato 500 se il segreto JWT non è definito o se si verifica qualsiasi altro errore.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send("Username and password are required");
      return;
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    const connection = await connect();
    const [rows]: any = await connection.execute(sql, [username]);

    if (rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Unauthorized");
    }

    if (!process.env.SECRET_KEY) {
      return res.status(500).send("JWT secret is not defined");
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: process.env.TOKEN_EXPIRE,
    });
    res.json({ token });
  } catch (error) {
    res.status(500).send("An error occurred");
  }
};

/**
 * Registra un nuovo utente.
 *
 * @param username - Il nome utente dell'utente.
 * @param password - La password dell'utente.
 * @param email - L'email dell'utente.
 *
 * @returns Un messaggio di conferma se l'utente è stato creato con successo.
 *
 * @throws Invierà uno stato 400 se username, password o email sono mancanti.
 *         Invierà uno stato 400 se username, password o email sono vuoti.
 *         Invierà uno stato 400 se l'email non è valida.
 *         Invierà uno stato 400 se la password è inferiore a 8 caratteri.
 *         Invierà uno stato 500 se si verifica un errore durante la creazione dell'utente.
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      res.status(400).send("Username, password and email are required");
      return;
    }

    if (
      username.trim() === "" ||
      password.trim() === "" ||
      email.trim() === ""
    ) {
      res.status(400).send("Username, password and email cannot be empty");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).send("Invalid email format");
      return;
    }

    if (password.length < 8) {
      res.status(400).send("Password must be at least 8 characters long");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const sql =
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    const connection = await connect();
    await connection.execute(sql, [username, hashedPassword, email]);

    res.status(201).send("User created");
  } catch (error) {
    res.status(500).send("An error occurred");
  }
};

/**
 * Funzione middleware per verificare l'autenticazione di una richiesta.
 *
 * Questa funzione estrae il token JWT dall'intestazione `Authorization`,
 * lo verifica utilizzando la chiave segreta definita nelle variabili d'ambiente,
 * e restituisce il token decodificato se valido.
 *
 * @param token - Il token JWT da verificare.
 *
 * @returns Una risposta JSON con il token decodificato se il token è valido,
 *          oppure un messaggio di errore con il codice di stato appropriato se il token è invalido o si verifica un errore.
 *
 * @throws Restituirà un codice di stato 401 se il token è mancante o invalido.
 *         Restituirà un codice di stato 500 se la chiave segreta JWT non è definita o si verifica un errore durante l'elaborazione.
 */
export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token || token === '') {
      console.log("Authorization token is missing or empty");
      return res.status(401).send("Unauthorized");
    }

    if (!process.env.SECRET_KEY) {
      console.log("JWT secret is not defined");
      return res.status(500).send("JWT secret is not defined");
    }

    if (invalidatedTokens.includes(token)) {
      console.log("Token has been invalidated");
      return res.status(403).send("Invalid token.");
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.error("Token has expired:", err);
          return logout(req, res); // Chiama la funzione di logout
        } else {
          console.error("Invalid token:", err);
          return res.status(403).send("Invalid token.");
        }
      }
      
      next();
    });
  } catch (error) {
    console.log("An error occurred:", error);
    res.status(500).send("An error occurred");
  }
};

/**
 * Effettua il logout dell'utente.
 *
 * @param req - La richiesta HTTP.
 * @param res - La risposta HTTP.
 */
export const logout = (req: Request, res: Response) => {
  res.status(200).send("Logged out successfully");
};
