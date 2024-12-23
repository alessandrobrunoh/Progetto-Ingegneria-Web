import jwt from "jsonwebtoken";

/**
 * Decodifica il token JWT e restituisce l'ID dell'utente.
 *
 * @param token Il token JWT da decodificare.
 * 
 * @returns L'ID dell'utente se il token è valido, altrimenti null.
 */
export const getUserIdFromToken = (token: string): string | null => {
  if (!process.env.SECRET_KEY) {
    throw new Error("JWT secret is not defined");
  }

  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.id;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};