import { connect } from './database';

export const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const isCodeUnique = async (code: string) => {
    const connection = await connect();
    const sql = 'SELECT * FROM rooms WHERE code = ?';
    const [rows]: any = await connection.execute(sql, [code]);
    return rows.length === 0;
}