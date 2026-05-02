const pool = require('../config/db.js');

const findUserByUserName = (userName, callback) => {
    const query = 'SELECT * FROM users WHERE userName = ?';
    pool.query(query, [userName], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

const createUser = (userData, callback) => {
    const query = 'INSERT INTO users (userName, password) VALUES (?, ?)';
    pool.query(query, [userData.userName, userData.password], (err, results) => {
        if (err) return callback(err);
        callback(null, results.insertId);
    });
};

const findUserById = (userId, callback) => {
    const query = 'SELECT * FROM users WHERE userID = ?';
    pool.query(query, [userId], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

const updateRefreshToken = (userId, refreshToken, callback) => {
    const query = 'UPDATE users SET refreshToken = ? WHERE userID = ?';
    pool.query(query, [refreshToken, userId], (err, results) => {
        if (err) return callback(err);
        callback(null, results.affectedRows > 0);
    });
};

const clearRefreshToken = (userId, callback) => {
    const query = 'UPDATE users SET refreshToken = NULL WHERE userID = ?';
    pool.query(query, [userId], (err, results) => {
        if (err) return callback(err);
        callback(null, results.affectedRows > 0);
    });
};

const findUserByRefreshToken = (refreshToken, callback) => {
    const query = 'SELECT * FROM users WHERE refreshToken = ?';
    pool.query(query, [refreshToken], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

module.exports = {
    findUserByUserName,
    createUser,
    findUserById,
    updateRefreshToken,
    clearRefreshToken,
    findUserByRefreshToken
};
