const express = require('express');
const {
    createDepartmentController,
    getDepartments,
    getDepartment,
    updateDepartmentController,
    deleteDepartmentController
} = require('../controllers/department.controller.js');

const { authenticateToken } = require('../middleware/middleware.js');

const router = express.Router();

// All department routes require authentication
router.use(authenticateToken);

// Create new department
router.post('/', createDepartmentController);

// Get all departments
router.get('/', getDepartments);

// Get department by ID
router.get('/:id', getDepartment);

// Update department
router.put('/:id', updateDepartmentController);

// Delete department
router.delete('/:id', deleteDepartmentController);

module.exports = router;