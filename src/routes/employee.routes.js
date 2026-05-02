const express = require('express');
const {
    createEmployeeWithDetails,
    getEmployees,
    getEmployee,
    updateEmployeeData,
    deleteEmployeeData,
    getEmployeesByDept,
    getEmployeesBySuper
} = require('../controllers/employee.controller.js');

const { authenticateToken } = require('../middleware/middleware.js');

const router = express.Router();

// All employee routes require authentication
router.use(authenticateToken);

// Create new employee
router.post('/', createEmployeeWithDetails);

// Get all employees
router.get('/', getEmployees);

// Get employee by ID
router.get('/:id', getEmployee);

// Update employee
router.put('/:id', updateEmployeeData);

// Delete employee
router.delete('/:id', deleteEmployeeData);

// Get employees by department
router.get('/department/:departmentId', getEmployeesByDept);

// Get employees by supervisor
router.get('/supervisor/:supervisorId', getEmployeesBySuper);

module.exports = router;