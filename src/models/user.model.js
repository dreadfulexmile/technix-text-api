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

module.exports = {
    findUserByUserName,
    createUser
};