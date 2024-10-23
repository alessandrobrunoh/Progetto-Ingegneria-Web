const mysql = require('mysql2/promise');
import {db} from "@/config";

export const connect = async () => {
    const connection = await mysql.createConnection(db);
    return connection;
}

export const query = async (connection, sql, values) => {
    const [rows] = await connection.execute(sql, values);
    return rows;
}

export const close = async (connection) => {
    await connection.end();
}
