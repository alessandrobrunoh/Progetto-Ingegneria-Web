const bcrypt = require('bcryptjs');
const db = require('../utils/database');

const updateUsername = async (req, res) => {
    const { username } = req.body;
    const sql = 'UPDATE users SET username = ? WHERE id = ?';
    db.Connection.query(sql, [username, req.user.id], (err, result) => {
        if (err) return res.status(500).send('Error in query');
        res.send('Username updated successfully');
    });
}

const updatePassword = async (req, res) => {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 cicli di salatura
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    db.Connection.query(sql, [hashedPassword, req.user.id], (err, result) => {
        if (err) return res.status(500).send('Error in query');
        res.send('Password updated successfully');
    });
}

const updateEmail = async (req, res) => {
    const { email } = req.body;
    const sql = 'UPDATE users SET email = ? WHERE id = ?';
    db.Connection.query(sql, [email, req.user.id], (err, result) => {
        if (err) return res.status(500).send('Error in query');
        res.send('Email updated successfully');
    });
}

const updateAvatar = async (req, res) => {
    const { avatar } = req.body;
    const sql = 'UPDATE users SET avatar = ? WHERE id = ?';
    db.Connection.query(sql, [avatar, req.user.id], (err, result) => {
        if (err) return res.status(500).send('Error in query');
        res.send('Avatar updated successfully');
    });
}

const saveProfile = async (req, res) => {
    const { username, email, password, avatar } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 
    const sql = 'UPDATE users SET username = ?, email = ?, password = ?, avatar = ? WHERE id = ?';
    db.Connection.query(sql, [username, email, hashedPassword, avatar, req.user.id], (err, result) => {
        if (err) return res.status(500).send('Error in query');
        res.send('Profile updated successfully');
    });
};  	

module.exports = {
    updateUsername,
    updatePassword,
    updateEmail,
    updateAvatar, 
    saveProfile
};