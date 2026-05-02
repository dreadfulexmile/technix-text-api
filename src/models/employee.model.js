const pool = require('../config/db.js');

// Employee CRUD operations
const createEmployee = (employeeData, callback) => {
    const query = `INSERT INTO employees
        (employeeNumber, firstName, lastName, birthday, address, email, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        employeeData.employeeNumber,
        employeeData.firstName,
        employeeData.lastName,
        employeeData.birthday,
        employeeData.address,
        employeeData.email,
        employeeData.phone
    ];
    pool.query(query, values, (err, results) => {
        if (err) return callback(err);
        callback(null, results.insertId);
    });
};

const getAllEmployees = (callback) => {
    const query = 'SELECT * FROM employees ORDER BY employeeId DESC';
    pool.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const getEmployeeById = (employeeId, callback) => {
    const query = 'SELECT * FROM employees WHERE employeeId = ?';
    pool.query(query, [employeeId], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

const getEmployeeByNumber = (employeeNumber, callback) => {
    const query = 'SELECT * FROM employees WHERE employeeNumber = ?';
    pool.query(query, [employeeNumber], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

const updateEmployee = (employeeId, employeeData, callback) => {
    const query = `UPDATE employees SET
        employeeNumber = ?, firstName = ?, lastName = ?, birthday = ?,
        address = ?, email = ?, phone = ?
        WHERE employeeId = ?`;
    const values = [
        employeeData.employeeNumber,
        employeeData.firstName,
        employeeData.lastName,
        employeeData.birthday,
        employeeData.address,
        employeeData.email,
        employeeData.phone,
        employeeId
    ];
    pool.query(query, values, (err, results) => {
        if (err) return callback(err);
        callback(null, results.affectedRows > 0);
    });
};

const deleteEmployee = (employeeId, callback) => {
    const query = 'DELETE FROM employees WHERE employeeId = ?';
    pool.query(query, [employeeId], (err, results) => {
        if (err) return callback(err);
        callback(null, results.affectedRows > 0);
    });
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    getEmployeeByNumber,
    updateEmployee,
    deleteEmployee
};