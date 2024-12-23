import { Request, Response } from 'express';
import { connect } from '../utils/database';
import { generateCode, isCodeUnique } from '../utils/codeRoom';
import { getUserIdFromToken } from '../utils/getIdByToken';
import { debugPrint } from '../utils/debugPrint';

/**
 * Recupera tutte le stanze dal database e le invia come risposta JSON.
 *
 * @returns Una promessa che risolve inviando i dati delle stanze come risposta JSON.
 *
 * @throws Invia un codice di stato 500 se si verifica un errore durante la query al database.
 * 
 * @example "GET: /api/rooms"
 */
export const getRooms = async (req: Request, res: Response) => {
    try {
        const connection = await connect();
        const [rows]: any = await connection.execute('SELECT * FROM rooms');
        debugPrint('Fetched all rooms from the database');
        debugPrint('Sending rooms data as JSON response');
        res.json(rows);
    } catch (error) {
        debugPrint('Error occurred while fetching rooms');
        res.status(500).send('An error occurred');
    }
}

/**
 * Recupera una stanza dal database in base all'ID fornito nei parametri della richiesta.
 * 
 * @param req - L'oggetto della richiesta HTTP, contenente i parametri della richiesta.
 * @param res - L'oggetto della risposta HTTP, utilizzato per inviare la risposta al client.
 * 
 * @returns Restituisce i dettagli della stanza come JSON se trovata, altrimenti restituisce un errore 500.
 * 
 * @example "GET: /api/rooms/1"
 */
export const getRoom = async (req: Request, res: Response) => {
    const { code } = req.params;
    try {
        const connection = await connect();
        const [rows]: any = await connection.execute('SELECT * FROM rooms WHERE code = ?', [code]);
        debugPrint(`Fetched room with ID: ${code}`);
        debugPrint('Sending room data as JSON response');
        res.json(rows[0]);
    } catch (error) {
        debugPrint(`Error occurred while fetching room with ID: ${code}`);
        console.error('Error details:', error);
        res.status(500).send('An error occurred');
    }
}

/**
 * Ottiene i giocatori di una stanza specifica.
 * 
 * @returns Una lista di giocatori presenti nella stanza specificata.
 * 
 * @throws Restituisce un errore 500 se si verifica un problema durante l'esecuzione della query.
 * 
 * @example "GET: /api/rooms/1/players"
 */
export const getRoomPlayers = async (req: Request, res: Response) => {
    const { code } = req.params;
    try {
        const connection = await connect();
        const [rows]: any = await connection.execute('SELECT * FROM players WHERE room_code = ?', [code]);
        debugPrint(`Fetched players for room with CODE: ${code}`);
        debugPrint('Sending players data as JSON response');
        res.json(rows);
    } catch (error) {
        debugPrint(`Error occurred while fetching players for room with CODE: ${code}`);
        res.status(500).send('An error occurred');
    }
}

/**
 * Recupera le carte del tavolo di una stanza specifica.
 *
 * @returns Un array di carte del tavolo in formato JSON.
 *
 * @throws Restituisce un errore 500 se si verifica un problema durante l'esecuzione della query.
 * 
 * @example "GET: /api/rooms/1/table_cards" 
 */
export const getRoomTableCards = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const connection = await connect();
        const [rows]: any = await connection.execute('SELECT * FROM table_cards WHERE room_code = ?', [id]);
        debugPrint(`Fetched table cards for room with ID: ${id}`);
        debugPrint('Sending table cards data as JSON response');
        res.json(rows);
    } catch (error) {
        debugPrint(`Error occurred while fetching table cards for room with ID: ${id}`);
        res.status(500).send('An error occurred');
    }
}

/**
 * Ottiene la mano di un giocatore specifico in una stanza.
 *
 * @returns Una risposta JSON contenente la mano del giocatore.
 *
 * @throws Restituisce un errore 500 se si verifica un problema durante l'esecuzione della query.
 * 
 * @example "GET: /api/rooms/1/players/1/hand"
 */
export const getPlayerHand = async (req: Request, res: Response) => {
    const { id, player_id } = req.params;
    try {
        const connection = await connect();
        const [rows]: any = await connection.execute('SELECT * FROM hands WHERE room_code = ? AND player_id = ?', [id, player_id]);
        debugPrint(`Fetched hand for player with ID: ${player_id} in room with ID: ${id}`);
        debugPrint('Sending player hand data as JSON response');
        res.json(rows);
    } catch (error) {
        debugPrint(`Error occurred while fetching hand for player with ID: ${player_id} in room with ID: ${id}`);
        res.status(500).send('An error occurred');
    }
}


/**
 * Crea una nuova stanza con un codice univoco.
 * 
 * @returns Una risposta HTTP che indica se la stanza è stata creata con successo
 * 
 * @throws Restituisce una risposta HTTP con stato 500 se si verifica un errore durante la creazione della stanza.
 * 
 * @example "POST: /api/rooms"
 */
export const createRoom = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        debugPrint('Authorization token is missing');
        return res.status(401).send('Authorization token is missing');
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
        debugPrint('Invalid or expired token');
        return res.status(401).send('Invalid or expired token');
    }

    try { 
        let code: string = '';
        let unique = false;
        
        while (!unique) {
            code = generateCode();
            unique = await isCodeUnique(code);
        }
        
        const connection = await connect();
        // ? Creo la stanza con il codice generato e il giocatore che ha creato la stanza come giocatore attivo
        await connection.execute('INSERT INTO rooms (code, turn_player_id) VALUES (?, ?)', [code, userId]);
        debugPrint(`Created room with CODE: ${code} and user ID: ${userId}`);
        // ? Aggiungo il giocatore che ha creato la stanza come host
        await connection.execute('INSERT INTO players (room_code, user_id, host) VALUES (?, ?, ?)', [code, userId, true]);
        debugPrint(`Player with ID: ${userId} joined room with CODE: ${code}`);

        debugPrint('Sending room code as JSON response');
        res.json(code);
    }
    catch (error) {
        debugPrint('Error occurred while creating room');
        console.log(error); 
        res.status(500).send('An error occurred');
    }
}

/**
 * Elimina una stanza dal database.
 *
 * @param req - La richiesta HTTP contenente l'ID della stanza da eliminare nel corpo.
 * @param res - La risposta HTTP che verrà inviata al client.
 * 
 * @returns Una risposta HTTP che indica se la stanza è stata eliminata con successo o se si è verificato un errore.
 */
export const deleteRoom = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        const connection = await connect();
        await connection.execute('DELETE FROM rooms WHERE id = ?', [id]);

        debugPrint(`Deleted room with ID: ${id}`);
        res.send('Room deleted');
    } catch (error) {
        res.status(500).send('An error occurred');
    }
}

/**
 * Aggiunge un giocatore a una stanza specificata.
 *
 * @param req - L'oggetto della richiesta, contenente i parametri della stanza e il corpo della richiesta con l'ID del giocatore.
 * @param res - L'oggetto della risposta, utilizzato per inviare la risposta al client.
 * 
 * @returns Una promessa che risolve con un messaggio di conferma o un errore.
 *
 * @throws Restituisce un errore 500 se si verifica un problema durante l'inserimento del giocatore nella stanza.
 */
export const joinRoom = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { player_id } = req.body;
    try {
        const connection = await connect();
        await connection.execute('INSERT INTO players (room_code, player_id) VALUES (?, ?)', [id, player_id]);

        debugPrint(`Player with ID: ${player_id} joined room with ID: ${id}`);
        res.send('Player joined room');
    } catch (error) {
        res.status(500).send('An error occurred');
    }
}

/**
 * Gestisce la richiesta per far uscire un giocatore da una stanza.
 * 
 * @param id - L'ID della stanza.
 * @param player_id - L'ID del giocatore all' interno della stanza
 * 
 * @returns Una risposta HTTP che indica se il giocatore ha lasciato la stanza con successo o se si è verificato un errore.
 * 
 * @throws Restituisce una risposta HTTP con stato 500 se si verifica un errore durante l'operazione.
 */
export const leaveRoom = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { player_id } = req.body;
    try {
        const connection = await connect();
        await connection.execute('DELETE FROM players WHERE room_code = ? AND player_id = ?', [id, player_id]);

        debugPrint(`Player with ID: ${player_id} left room with ID: ${id}`);
        res.send('Player left room');
    } catch (error) { 
        res.status(500).send('An error occurred'); 
    }
}

/**
 * Avvia il gioco aggiornando lo stato della stanza a "in progress".
 * 
 * @param id - L'ID della stanza.
 * 
 * @returns Una risposta che indica se il gioco è stato avviato con successo o se si è verificato un errore.
 */
export const startGame = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const connection = await connect();
        await connection.execute('UPDATE rooms SET status = "in progress" WHERE id = ?', [id]);

        debugPrint(`Game started for room with ID: ${id}`);
        res.send('Game started');
    } catch (error) {
        res.status(500).send('An error occurred');
    }
}

/**
 * Termina il gioco aggiornando lo stato della stanza a "ended".
 * 
 * @param id - L'ID della stanza.
 * 
 * @returns Una risposta HTTP che indica se il gioco è stato terminato con successo o se si è verificato un errore.
 * 
 * @throws Restituisce uno stato 500 se si verifica un errore durante l'aggiornamento dello stato della stanza.
 */
export const endGame = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const connection = await connect();
        await connection.execute('UPDATE rooms SET status = "ended" WHERE id = ?', [id]);

        debugPrint(`Game ended for room with ID: ${id}`);
        res.send('Game ended');
    } catch (error) {
        res.status(500).send('An error occurred');
    }
}

/**
 * Gioca una carta in una stanza specifica.
 * 
 * @param id - L'ID della stanza.
 * @param player_id - L'ID del giocatore che gioca la carta.
 * @param card_id - L'ID della carta da giocare.
 * 
 * @returns Una risposta che indica se la carta è stata giocata con successo o se si è verificato un errore.
 * 
 * @throws Restituisce un errore 500 se si verifica un problema durante l'inserimento della carta nel database.
 * 
 * @example "POST: /api/rooms/1/players/1/play/1"
 */
export const playCard = async (req: Request, res: Response) => {
    const { id, player_id, card_id } = req.params;
    try {
        const connection = await connect();
        await connection.execute('INSERT INTO table_cards (room_code, player_id, card_id) VALUES (?, ?, ?)', [id, player_id, card_id]);
        
        debugPrint(`Player with ID: ${player_id} played card with ID: ${card_id} in room with ID: ${id}`);
        res.send('Card played');
    } catch (error) {
        res.status(500).send('An error occurred');
    }
}

/**
 * Passa il turno incrementando il valore del campo `turn` nella tabella `rooms` per l'ID specificato.
 * 
 * @param req - L'oggetto della richiesta, contenente i parametri della richiesta.
 * @param res - L'oggetto della risposta, utilizzato per inviare la risposta al client.
 * 
 * @returns Una risposta con un messaggio di conferma o un messaggio di errore in caso di fallimento.
 */
export const passTurn = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const connection = await connect();
        await connection.execute('UPDATE rooms SET turn = turn + 1 WHERE id = ?', [id]);
       
        debugPrint(`Turn passed for room with ID: ${id}`);
        res.send('Turn passed');
    } catch (error) {
        res.status(500).send('An error occurred');
    }
}

/**
 * Estrae una carta casuale e la inserisce nella mano del giocatore specificato.
 * 
 * @param req - L'oggetto della richiesta, contenente i parametri `id` (ID della stanza) e `player_id` (ID del giocatore).
 * @param res - L'oggetto della risposta, utilizzato per inviare la risposta al client.
 * 
 * @returns Una risposta che indica se la carta è stata estratta con successo o se si è verificato un errore.
 * 
 * @throws Restituisce un errore 500 se si verifica un problema durante l'estrazione della carta.
 */
export const drawCard = async (req: Request, res: Response) => {
    const { id, player_id } = req.params;
    try {
        const connection = await connect();
        await connection.execute('INSERT INTO hands (room_code, player_id, card_id) VALUES (?, ?, ?)', [id, player_id, Math.floor(Math.random() * 52) + 1]); // TODO: Sistemare il generatore della carta deve controllare che é una delle carte rimanenti nel mazzo
        
        debugPrint(`Player with ID: ${player_id} drew a card in room with ID: ${id}`);
        res.send('Card drawn');
    } catch (error) {
        res.status(500).send('An error occurred');
    }
}

