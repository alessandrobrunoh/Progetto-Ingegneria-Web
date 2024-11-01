const db = require('mysql2');

const Connection = db.createConnection(
    {
        host: '192.168.1.57',
        user: 'root',
        password: '',
        database: 'briscola',
    }
);

module.exports = {
    Connection
}