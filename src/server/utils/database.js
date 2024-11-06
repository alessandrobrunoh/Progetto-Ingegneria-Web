const db = require('mysql2');

const Connection = db.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "briscola",
});

module.exports = {
    Connection
}
