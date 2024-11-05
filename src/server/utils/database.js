const db = require('mysql2');
require('dotenv').config();

const Connection = db.createConnection({
    host: "localhost",
    user: "admin",
    password: "password",
    database: "briscola",
});

module.exports = {
    Connection
}
