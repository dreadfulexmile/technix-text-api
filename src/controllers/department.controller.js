const {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} = require('../models/department.model.js');

// Create a new department
const createDepartmentController = async (req, res) => {
    try {
        const { departmentName, departmentHead } = req.body;

        if (!departmentName) {
            return res.status(400).json({ message: 'Department name is required' });
        }

        const departmentData = {
            departmentName,
            departmentHead: departmentHead || null
        };

        createDepartment(departmentData, (err, departmentId) => {
            if (err) {
                return res.status(500).json({ message: 'Error creating department', error: err.message });
            }

            res.status(201).json({
                message: 'Department created successfully',
                departmentId
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create department', error: error.message });
    }
};

// Get all departments
const getDepartments = async (req, res) => {
    try {
        getAllDepartments((err, departments) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching departments', error: err.message });
            }

            res.status(200).json({
                message: 'Departments retrieved successfully',
                departments
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch departments', error: error.message });
    }
};

// Get a single department by ID
const getDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Department ID is required' });
        }

        getDepartmentById(id, (err, department) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching department', error: err.message });
            }

            if (!department) {
                return res.status(404).json({ message: 'Department not found' });
            }

            res.status(200).json({
                message: 'Department retrieved successfully',
                department
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch department', error: error.message });
    }
};

// Update a department
const updateDepartmentController = async (req, res) => {
    try {
        const { id } = req.params;
        const { departmentName, departmentHead } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Department ID is required' });
        }

        if (!departmentName) {
            return res.status(400).json({ message: 'Department name is required' });
        }

        const departmentData = {
            departmentName,
            departmentHead: departmentHead || null
        };

        updateDepartment(id, departmentData, (err, success) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating department', error: err.message });
            }

            if (!success) {
                return res.status(404).json({ message: 'Department not found' });
            }

            res.status(200).json({
                message: 'Department updated successfully'
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update department', error: error.message });
    }
};

// Delete a department
const deleteDepartmentController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Department ID is required' });
        }

        deleteDepartment(id, (err, success) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting department', error: err.message });
            }

            if (!success) {
                return res.status(404).json({ message: 'Department not found' });
            }

            res.status(200).json({
                message: 'Department deleted successfully'
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete department', error: error.message });
    }
};

module.exports = {
    createDepartmentController,
    getDepartments,
    getDepartment,
    updateDepartmentController,
    deleteDepartmentController
};