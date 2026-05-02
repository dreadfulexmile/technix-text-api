const pool = require('../config/db.js');

// EmployeeDetails CRUD operations
const createEmployeeDetails = (detailsData, callback) => {
    const query = `INSERT INTO employeeDetails
        (employeeId, departmentId, joinedDate, terminatedDate, status, supervisor)
        VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
        detailsData.employeeId,
        detailsData.departmentId,
        detailsData.joinedDate,
        detailsData.terminatedDate,
        detailsData.status,
        detailsData.supervisor
    ];
    pool.query(query, values, (err, results) => {
        if (err) return callback(err);
        callback(null, results.insertId);
    });
};

const getEmployeeDetailsByEmployeeId = (employeeId, callback) => {
    const query = 'SELECT * FROM employeeDetails WHERE employeeId = ?';
    pool.query(query, [employeeId], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

const getAllEmployeeDetails = (callback) => {
    const query = `SELECT ed.*, e.firstName, e.lastName, e.employeeNumber,
        d.departmentName
        FROM employeeDetails ed
        LEFT JOIN employees e ON ed.employeeId = e.employeeId
        LEFT JOIN departments d ON ed.departmentId = d.departmentId
        ORDER BY ed.employeeId DESC`;
    pool.query(query, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const updateEmployeeDetails = (employeeId, detailsData, callback) => {
    const query = `UPDATE employeeDetails SET
        departmentId = ?, joinedDate = ?, terminatedDate = ?, status = ?, supervisor = ?
        WHERE employeeId = ?`;
    const values = [
        detailsData.departmentId,
        detailsData.joinedDate,
        detailsData.terminatedDate,
        detailsData.status,
        detailsData.supervisor,
        employeeId
    ];
    pool.query(query, values, (err, results) => {
        if (err) return callback(err);
        callback(null, results.affectedRows > 0);
    });
};

const deleteEmployeeDetails = (employeeId, callback) => {
    const query = 'DELETE FROM employeeDetails WHERE employeeId = ?';
    pool.query(query, [employeeId], (err, results) => {
        if (err) return callback(err);
        callback(null, results.affectedRows > 0);
    });
};

const getEmployeesByDepartment = (departmentId, callback) => {
    const query = `SELECT e.*, ed.joinedDate, ed.status, ed.supervisor
        FROM employees e
        INNER JOIN employeeDetails ed ON e.employeeId = ed.employeeId
        WHERE ed.departmentId = ? AND ed.status = 'active'
        ORDER BY e.firstName, e.lastName`;
    pool.query(query, [departmentId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const getEmployeesBySupervisor = (supervisorId, callback) => {
    const query = `SELECT e.*, ed.joinedDate, ed.status, ed.departmentId
        FROM employees e
        INNER JOIN employeeDetails ed ON e.employeeId = ed.employeeId
        WHERE ed.supervisor = ? AND ed.status = 'active'
        ORDER BY e.firstName, e.lastName`;
    pool.query(query, [supervisorId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

module.exports = {
    createEmployeeDetails,
    getEmployeeDetailsByEmployeeId,
    getAllEmployeeDetails,
    updateEmployeeDetails,
    deleteEmployeeDetails,
    getEmployeesByDepartment,
    getEmployeesBySupervisor
};