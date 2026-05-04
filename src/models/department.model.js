const pool = require('../config/db.js');

// Department CRUD operations
const createDepartment = (departmentData, callback) => {
    const query = `INSERT INTO departments
        (departmentName, departmentHead)
        VALUES (?, ?)`;
    const values = [
        departmentData.departmentName,
        departmentData.departmentHead
    ];
    pool.query(query, values, (err, results) => {
        if (err) return callback(err);
        callback(null, results.insertId);
    });
};

const getAllDepartments = (callback) => {
    const query = `SELECT d.*, e.firstName, e.lastName, e.employeeNumber
        FROM departments d
        LEFT JOIN employees e ON d.departmentHead = e.employeeId
        ORDER BY d.departmentName`;
    pool.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const getDepartmentById = (departmentId, callback) => {
    const query = `SELECT d.*, e.firstName, e.lastName, e.employeeNumber
        FROM departments d
        LEFT JOIN employees e ON d.departmentHead = e.employeeId
        WHERE d.departmentId = ?`;
    pool.query(query, [departmentId], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

const updateDepartment = (departmentId, departmentData, callback) => {
    const query = `UPDATE departments SET
        departmentName = ?, departmentHead = ?
        WHERE departmentId = ?`;
    const values = [
        departmentData.departmentName,
        departmentData.departmentHead,
        departmentId
    ];
    pool.query(query, values, (err, results) => {
        if (err) return callback(err);
        callback(null, results.affectedRows > 0);
    });
};

const deleteDepartment = (departmentId, callback) => {
    const query = 'DELETE FROM departments WHERE departmentId = ?';
    pool.query(query, [departmentId], (err, results) => {
        if (err) return callback(err);
        callback(null, results.affectedRows > 0);
    });
};

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};