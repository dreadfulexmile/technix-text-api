const pool = require('../config/db.js');

const findUserByEmail = (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    pool.query(query, [email], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

const createUser = (userData, callback) => {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    pool.query(query, [userData.name, userData.email, userData.password], (err, results) => {
        if (err) return callback(err);
        callback(null, results.insertId);
    });
};

module.exports = {
    findUserByEmail,
    createUser
};