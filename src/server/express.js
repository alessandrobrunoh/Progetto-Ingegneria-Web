// TODO: Assicurarsi che tutti i file controllino se il Token é valido prima di eseguire le operazioni
// TODO: Suddividere il codice in moduli separati per mantenere il codice pulito e organizzato
// TODO: Aggiungere un ErrorHandler per gestire gli errori in modo piu pulito

const express = require('express');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('utils/database');
const setupSocket = require('webSocket');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);
const PORT = 8000;
// TODO: Inserire questa secretKey in un file .env
const secretKey = 'your-secret-key'; // TODO: Far generare questa secretKey da un modulo di sicurezza (es. bcrypt)


app.use(cors({
    origin: process.env.VUE_APP_API_ORIGIN,
    credentials: true
}));
app.use(express.json());

// TODO: Assicurarsi che questa API login controlli che il Token sia valido prima di eseguire la funzione
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Received login request:', { username, password });

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.Connection.query(sql, [username], async (err, result) => {
        if (err) {
            console.error('Error in query', err);
            res.status(500).send('Error in query');
            return;
        }
        if (result.length === 0) {
            console.log('Login failed: Username or password is incorrect');
            res.status(401).send('Username or password is incorrect');
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, result[0].password);
        if (!isPasswordValid) {
            console.log('Login failed: Username or password is incorrect');
            res.status(401).send('Username or password is incorrect');
            return;
        }
        // Generate a JWT token
        const token = jwt.sign({ id: result[0].id, username: result[0].username }, secretKey, { expiresIn: '1h' }); // TODO The token expiry is set to 1 hour, but there is no mechanism to refresh the token, so add a refresh token mechanism.
        console.log('Login successful:', result);
        res.json({ token });
    });
});

// TODO: Assicurarsi che questa API register controlli se il Token é valido prima di eseguire la funzione
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.Connection.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error inserting data');
            return;
        }
        console.log('Data inserted:', result);
        res.send('Data inserted successfully');
    });
});


// TODO: Assicurarsi che questa API check-auth controlli se il Token é valido prima di eseguire la funzione
app.get('/api/check-auth', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.json({ isAuthenticated: false });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.json({ isAuthenticated: false });
        }
        res.json({ isAuthenticated: true, user: decoded });
    });
});

// TODO: Assicurarsi che questa API rooms controlli se il Token é valido prima di eseguire la funzione
app.get('/api/rooms', (req, res) => {
    const sql = 'SELECT * FROM rooms';
    db.Connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

// TODO: Assicurarsi che questa API room controlli se il Token é valido prima di eseguire la funzione
app.get('/api/room/:code', (req, res) => {
    const sql = 'SELECT * FROM rooms WHERE code = ?';
    db.Connection.query(sql, [req.params.code], (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

// TODO: Assicurarsi che questa API room players controlli se il Token é valido prima di eseguire la funzione
app.get('/api/room/:code/players', (req, res) => {
    const sql = `
        SELECT players.*, users.username AS name /* .* per selezionare le colonne che ci interessano */
        FROM players
                 JOIN users ON players.user_id = users.id
        WHERE players.ROOM_code = ?
    `;
    db.Connection.query(sql, [req.params.code], (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

// TODO: Assicurarsi che questa API room table_cards controlli se il Token é valido prima di eseguire la funzione
app.get('/api/room/:code/table_cards', (req, res) => {
    const sql = 'SELECT * FROM table_cards WHERE PLAYERS_GAMES_code = ?';
    db.Connection.query(sql, [req.params.code], (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

// TODO: Assicurarsi che questa API room hand_cards controlli se il Token é valido prima di eseguire la funzione
app.get('/api/room/:code/player/:user_id/hand_cards', (req, res) => {
    const sql = 'SELECT number_card_1, seed_card_1, number_card_2, seed_card_2, number_card_3, seed_card_3 FROM hand_cards WHERE PLAYER_GAME_code = ? AND PLAYER_USER_id = ?';
    db.Connection.query(sql, [req.params.code, req.params.user_id], (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

// TODO: Assicurarsi che questa API rooms table_cards controlli se il Token é valido prima di eseguire la funzione
app.get('/api/rooms/table_cards', (req, res) => {
    const sql = 'SELECT * FROM table_cards';
    db.Connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

// TODO: Assicurarsi che questa API room players controlli se il Token é valido prima di eseguire la funzione
app.get('/api/rooms/players', (req, res) => {
    const sql = 'SELECT * FROM players';
    db.Connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

const generateRoomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomCode = '';
    for (let i = 0; i < 8; i++) {
        roomCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return roomCode;
};

const isRoomCodeUnique = async (roomCode) => {
    return new Promise((resolve, reject) => {
        const checkRoomCodeSql = 'SELECT COUNT(*) AS count FROM rooms WHERE code = ?';
        db.Connection.query(checkRoomCodeSql, [roomCode], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0].count === 0);
        });
    });
};

// TODO: Assicurarsi che questa API create-room controlli se il Token é valido prima di eseguire la funzione
// TODO: Aggiungere un controllo per evitare che un utente possa creare piu di una stanza
// TODO: Aggiungere un controllo per evitare che un utente possa entrare in piu stanze
// TODO: Aggiungere un controllo per evitare che un utente possa entrare in una stanza che é gia iniziata
// TODO: Modificare il codice per diminuire la complessitá del codice
app.post('/api/create-room', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized');
        }

        const userId = decoded.id;
        let roomCode;
        let isUnique = false;

        while (!isUnique) {
            roomCode = generateRoomCode();
            try {
                isUnique = await isRoomCodeUnique(roomCode);
            } catch (error) {
                console.error('Error checking room code uniqueness:', error);
                return res.status(500).send('Error creating room');
            }
        }

        const createRoomSql = 'INSERT INTO rooms (code, PLAYER_TURN_ID) VALUES (?, ?)';
        db.Connection.query(createRoomSql, [roomCode, userId], (err, result) => {
            if (err) {
                console.error('Error creating room:', err);
                res.status(500).send('Error creating room');
                return;
            }
            const addUserSql = 'INSERT INTO players (ROOM_code, user_id, team, host) VALUES (?, ?, 1, true)';
            db.Connection.query(addUserSql, [roomCode, userId], (err, result) => {
                if (err) {
                    console.error('Error adding user to room:', err);
                    res.status(500).send('Error adding user to room');
                    return;
                }
                console.log('User added to room:', result);
                res.json({ roomCode });
            });
        });
    });
});

// TODO: Assicurarsi che questa API join-room controlli se il Token é valido prima di eseguire la funzione
// TODO: Aggiungere un controllo per evitare che un utente possa entrare in piu stanze
// TODO: Aggiungere un controllo per evitare che un utente possa entrare in una stanza che é gia iniziata
// TODO: Modificare il codice per diminuire la complessitá del codice
app.post('/api/room/:roomCode/add-player', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized');
        }

        const userId = decoded.id;
        const roomCode = req.params.roomCode;

        // Query to get the number of players in each team
        const getTeamsSql = `
            SELECT
                SUM(CASE WHEN team = 1 THEN 1 ELSE 0 END) AS team1Count,
                SUM(CASE WHEN team = 2 THEN 1 ELSE 0 END) AS team2Count
            FROM players
            WHERE ROOM_code = ?
        `;
        db.Connection.query(getTeamsSql, [roomCode], (err, result) => {
            if (err) {
                console.error('Error fetching team counts:', err);
                res.status(500).send('Error fetching team counts');
                return;
            }

            const team1Count = result[0].team1Count || 0;
            const team2Count = result[0].team2Count || 0;
            const team = team1Count <= team2Count ? 1 : 2;

            // Insert the new player into the appropriate team
            const addUserSql = 'INSERT INTO players (ROOM_code, user_id, team) VALUES (?, ?, ?)';
            db.Connection.query(addUserSql, [roomCode, userId, team], (err, result) => {
                if (err) {
                    console.error('Error adding user to room:', err);
                    res.status(500).send('Error adding user to room');
                    return;
                }
                console.log('User added to room:', result);

                const player = { user_id: userId, name: decoded.username, team }; // Assuming username is in the token
                io.to(roomCode).emit('playerJoined', player);

                res.status(200).send('User added to room');
            });
        });
    });
});

// TODO: Assicurarsi che questa API room player ready controlli se il Token é valido prima di eseguire la funzione
// TODO: Aggiungere un controllo per evitare che un utente possa cambiare il suo stato di ready se la partita é gia iniziata
app.post('/api/room/:roomCode/player/:userId/ready', (req, res) => {
    const { roomCode, userId } = req.params;
    const { ready } = req.body;

    const sql = 'UPDATE players SET ready = ? WHERE ROOM_code = ? AND user_id = ?';
    db.Connection.query(sql, [ready, roomCode, userId], (err, result) => {
        if (err) {
            console.error('Error updating ready status:', err);
            res.status(500).send('Error updating ready status');
            return;
        }
        res.status(200).send('Ready status updated');
    });
});

app.use((req, res) => {
    res.status(404).send('404 Pagina non trovata');
});

server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});