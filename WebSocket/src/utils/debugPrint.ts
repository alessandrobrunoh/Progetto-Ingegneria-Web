import { printLines } from "./printLines";

/**
 * Stampa un messaggio di debug sulla console se l'ambiente è di sviluppo.
 *
 * @param message - Il messaggio da stampare sulla console.
 * 
 * @example "debugPrint("Hello, World!");"
 */
export const debugPrint = (message: string) => {
  if (process.env.DEBUG === "enabled") {
      console.log("DEBUG: ", message);
  }
};