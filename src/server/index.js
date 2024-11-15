require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const setupSocket = require('./webSocket.js');

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);
const PORT = process.env.PORT;

app.use(cors({
    origin: process.env.ORIGIN_CORS_IP, // Update this to match your client origin
    credentials: true
}));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

app.use('/api', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/room', (req, res, next) => {
    req.io = io;
    next();
}, roomRoutes);

app.use((req, res) => {
    res.status(404).send('404 Page not found');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});