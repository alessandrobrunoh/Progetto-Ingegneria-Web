const express = require('express');
const db = require("../utils/database");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 8000;
const secretKey = 'your-secret-key'; // Replace with a strong secret key

app.use(cors({
    origin: 'http://192.168.1.57:8080', // Replace with your client URL
    credentials: true
}));
app.use(express.json());

app.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    console.log('Received login request:', {username, password});

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
        const token = jwt.sign({id: result[0].id, username: result[0].username}, secretKey, {expiresIn: '1h'});
        console.log('Login successful:', result);
        res.json({token});
    });
});

app.post('/api/register', async (req, res) => {
    const {username, email, password} = req.body;
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

app.get('/api/check-auth', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.json({isAuthenticated: false});
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.json({isAuthenticated: false});
        }
        res.json({isAuthenticated: true, user: decoded});
    });
});

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

app.get('/api/room/:code/players', (req, res) => {
    const sql = 'SELECT * FROM players WHERE ROOM_code = ?';
    db.Connection.query(sql, [req.params.code], (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

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
            const addUserSql = 'INSERT INTO players (ROOM_code, user_id) VALUES (?, ?)';
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

    const addUserSql = 'INSERT INTO players (ROOM_code, user_id) VALUES (?, ?)';
    db.Connection.query(addUserSql, [roomCode, userId], (err, result) => {
      if (err) {
        console.error('Error adding user to room:', err);
        res.status(500).send('Error adding user to room');
        return;
      }
      console.log('User added to room:', result);
      res.status(200).send('User added to room');
    });
  });
});

app.use((req, res) => {
    res.status(404).send('404 Pagina non trovata');
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

