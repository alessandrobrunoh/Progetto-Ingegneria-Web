const express = require('express');
const http = require('http');
const cors = require('cors');
const setupSocket = require('./webSocket.js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);
const PORT = 8000;

app.use(cors({
	origin: ['http://localhost:8080', 'http://151.61.248.114:8080'], // Update this to match your client origin
    credentials: true
}));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');

app.use('/api', authRoutes);
app.use('/api', roomRoutes);

app.use((req, res) => {
    res.status(404).send('404 Page not found');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
