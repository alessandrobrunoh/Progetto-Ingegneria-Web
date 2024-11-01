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
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.Connection.query(sql, [username, hashedPassword], (err, result) => {
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

app.get('/api/games', (req, res) => {
    const sql = 'SELECT * FROM games';
    db.Connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

app.get('/api/game/:code', (req, res) => {
    const sql = 'SELECT * FROM games WHERE code = ?';
    db.Connection.query(sql, [req.params.code], (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

app.get('/api/game/:code/players', (req, res) => {
    const sql = 'SELECT * FROM players WHERE game_code = ?';
    db.Connection.query(sql, [req.params.code], (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

app.get('/api/game/:code/table_cards', (req, res) => {
    const sql = 'SELECT * FROM table_cards WHERE PLAYERS_GAMES_code = ?';
    db.Connection.query(sql, [req.params.code], (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

app.get('/api/game/:code/player/:user_id/hand_cards', (req, res) => {
    const sql = 'SELECT number_card_1, seed_card_1, number_card_2, seed_card_2, number_card_3, seed_card_3 FROM hand_cards WHERE PLAYER_GAME_code = ? AND PLAYER_USER_id = ?';
    db.Connection.query(sql, [req.params.code, req.params.user_id], (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

app.get('/api/games/table_cards', (req, res) => {
    const sql = 'SELECT * FROM table_cards';
    db.Connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

app.get('/api/games/players', (req, res) => {
    const sql = 'SELECT * FROM players';
    db.Connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Errore nella query');
            return;
        }
        res.json(result);
    });
});

app.use((req, res) => {
    res.status(404).send('404 Pagina non trovata');
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});



/*
const updatePasswords = async () => {
    const sqlSelect = 'SELECT id, password FROM users';
    db.Connection.query(sqlSelect, async (err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            return;
        }
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const sqlUpdate = 'UPDATE users SET password = ? WHERE id = ?';
            db.Connection.query(sqlUpdate, [hashedPassword, user.id], (err, result) => {
                if (err) {
                    console.error('Error updating password for user', user.id, err);
                } else {
                    console.log('Password updated for user', user.id);
                }
            });
        }
    });
};

updatePasswords();*/