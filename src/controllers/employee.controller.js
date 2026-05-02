const {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    getEmployeeByNumber,
    updateEmployee,
    deleteEmployee
} = require('../models/employee.model.js');

const {
    createEmployeeDetails,
    getEmployeeDetailsByEmployeeId,
    getAllEmployeeDetails,
    updateEmployeeDetails,
    deleteEmployeeDetails,
    getEmployeesByDepartment,
    getEmployeesBySupervisor
} = require('../models/employeeDetails.model.js');

// Create new employee with details
const createEmployeeWithDetails = async (req, res) => {
    try {
        const {
            employeeNumber,
            firstName,
            lastName,
            birthday,
            address,
            email,
            phone,
            departmentId,
            joinedDate,
            terminatedDate,
            status,
            supervisor
        } = req.body;

        // Validate required fields
        if (!employeeNumber || !firstName || !lastName || !email) {
            return res.status(400).json({
                message: 'Employee number, first name, last name, and email are required'
            });
        }

        // Check if employee number already exists
        getEmployeeByNumber(employeeNumber, (err, existingEmployee) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            if (existingEmployee) {
                return res.status(409).json({ message: 'Employee number already exists' });
            }

            // Create employee
            const employeeData = {
                employeeNumber,
                firstName,
                lastName,
                birthday,
                address,
                email,
                phone
            };

            createEmployee(employeeData, (err, employeeId) => {
                if (err) {
                    return res.status(500).json({ message: 'Error creating employee', error: err.message });
                }

                // Create employee details if provided
                if (departmentId && joinedDate && status) {
                    const detailsData = {
                        employeeId,
                        departmentId,
                        joinedDate,
                        terminatedDate,
                        status,
                        supervisor
                    };

                    createEmployeeDetails(detailsData, (detailsErr) => {
                        if (detailsErr) {
                            // If details creation fails, still return success for employee creation
                            console.error('Error creating employee details:', detailsErr);
                        }

                        res.status(201).json({
                            message: 'Employee created successfully',
                            employeeId,
                            employee: employeeData
                        });
                    });
                } else {
                    res.status(201).json({
                        message: 'Employee created successfully',
                        employeeId,
                        employee: employeeData
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Employee creation failed', error: error.message });
    }
};

// Get all employees with their details
const getEmployees = async (req, res) => {
    try {
        getAllEmployeeDetails((err, employees) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            res.status(200).json({
                message: 'Employees retrieved successfully',
                employees
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve employees', error: error.message });
    }
};

// Get employee by ID with details
const getEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        getEmployeeById(id, (err, employee) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            // Get employee details
            getEmployeeDetailsByEmployeeId(id, (detailsErr, details) => {
                const employeeWithDetails = {
                    ...employee,
                    details: details || null
                };

                res.status(200).json({
                    message: 'Employee retrieved successfully',
                    employee: employeeWithDetails
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve employee', error: error.message });
    }
};

// Update employee
const updateEmployeeData = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            employeeNumber,
            firstName,
            lastName,
            birthday,
            address,
            email,
            phone,
            departmentId,
            joinedDate,
            terminatedDate,
            status,
            supervisor
        } = req.body;

        // Check if employee exists
        getEmployeeById(id, (err, existingEmployee) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            if (!existingEmployee) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            // Check if new employee number conflicts with another employee
            if (employeeNumber && employeeNumber !== existingEmployee.employeeNumber) {
                getEmployeeByNumber(employeeNumber, (numErr, existingNum) => {
                    if (numErr) {
                        return res.status(500).json({ message: 'Database error', error: numErr.message });
                    }

                    if (existingNum && existingNum.employeeId !== parseInt(id)) {
                        return res.status(409).json({ message: 'Employee number already exists' });
                    }

                    // Update employee
                    const employeeData = {
                        employeeNumber: employeeNumber || existingEmployee.employeeNumber,
                        firstName: firstName || existingEmployee.firstName,
                        lastName: lastName || existingEmployee.lastName,
                        birthday: birthday || existingEmployee.birthday,
                        address: address || existingEmployee.address,
                        email: email || existingEmployee.email,
                        phone: phone || existingEmployee.phone
                    };

                    updateEmployee(id, employeeData, (updateErr, success) => {
                        if (updateErr) {
                            return res.status(500).json({ message: 'Error updating employee', error: updateErr.message });
                        }

                        if (!success) {
                            return res.status(404).json({ message: 'Employee not found' });
                        }

                        // Update employee details if provided
                        if (departmentId || joinedDate || status || supervisor !== undefined || terminatedDate !== undefined) {
                            const detailsData = {
                                departmentId,
                                joinedDate,
                                terminatedDate,
                                status,
                                supervisor
                            };

                            // Remove undefined values
                            Object.keys(detailsData).forEach(key => {
                                if (detailsData[key] === undefined) {
                                    delete detailsData[key];
                                }
                            });

                            if (Object.keys(detailsData).length > 0) {
                                updateEmployeeDetails(id, detailsData, (detailsErr) => {
                                    if (detailsErr) {
                                        console.error('Error updating employee details:', detailsErr);
                                    }
                                });
                            }
                        }

                        res.status(200).json({
                            message: 'Employee updated successfully',
                            employee: { ...employeeData, employeeId: parseInt(id) }
                        });
                    });
                });
            } else {
                // Update employee without checking employee number
                const employeeData = {
                    employeeNumber: employeeNumber || existingEmployee.employeeNumber,
                    firstName: firstName || existingEmployee.firstName,
                    lastName: lastName || existingEmployee.lastName,
                    birthday: birthday || existingEmployee.birthday,
                    address: address || existingEmployee.address,
                    email: email || existingEmployee.email,
                    phone: phone || existingEmployee.phone
                };

                updateEmployee(id, employeeData, (updateErr, success) => {
                    if (updateErr) {
                        return res.status(500).json({ message: 'Error updating employee', error: updateErr.message });
                    }

                    if (!success) {
                        return res.status(404).json({ message: 'Employee not found' });
                    }

                    // Update employee details if provided
                    if (departmentId || joinedDate || status || supervisor !== undefined || terminatedDate !== undefined) {
                        const detailsData = {
                            departmentId,
                            joinedDate,
                            terminatedDate,
                            status,
                            supervisor
                        };

                        // Remove undefined values
                        Object.keys(detailsData).forEach(key => {
                            if (detailsData[key] === undefined) {
                                delete detailsData[key];
                            }
                        });

                        if (Object.keys(detailsData).length > 0) {
                            updateEmployeeDetails(id, detailsData, (detailsErr) => {
                                if (detailsErr) {
                                    console.error('Error updating employee details:', detailsErr);
                                }
                            });
                        }
                    }

                    res.status(200).json({
                        message: 'Employee updated successfully',
                        employee: { ...employeeData, employeeId: parseInt(id) }
                    });
                });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Employee update failed', error: error.message });
    }
};

// Delete employee
const deleteEmployeeData = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if employee exists
        getEmployeeById(id, (err, employee) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            // Delete employee details first
            deleteEmployeeDetails(id, (detailsErr) => {
                // Then delete employee
                deleteEmployee(id, (deleteErr, success) => {
                    if (deleteErr) {
                        return res.status(500).json({ message: 'Error deleting employee', error: deleteErr.message });
                    }

                    if (!success) {
                        return res.status(404).json({ message: 'Employee not found' });
                    }

                    res.status(200).json({
                        message: 'Employee deleted successfully'
                    });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Employee deletion failed', error: error.message });
    }
};

// Get employees by department
const getEmployeesByDept = async (req, res) => {
    try {
        const { departmentId } = req.params;

        getEmployeesByDepartment(departmentId, (err, employees) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            res.status(200).json({
                message: 'Employees retrieved successfully',
                employees
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve employees', error: error.message });
    }
};

// Get employees by supervisor
const getEmployeesBySuper = async (req, res) => {
    try {
        const { supervisorId } = req.params;

        getEmployeesBySupervisor(supervisorId, (err, employees) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            res.status(200).json({
                message: 'Employees retrieved successfully',
                employees
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve employees', error: error.message });
    }
};

module.exports = {
    createEmployeeWithDetails,
    getEmployees,
    getEmployee,
    updateEmployeeData,
    deleteEmployeeData,
    getEmployeesByDept,
    getEmployeesBySuper
};