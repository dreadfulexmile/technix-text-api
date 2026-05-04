const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes.js');
const employeeRoutes = require('./src/routes/employee.routes.js');
const departmentRoutes = require('./src/routes/department.routes.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Employee routes
app.use('/api/employees', employeeRoutes);

// Department routes
app.use('/api/departments', departmentRoutes);

pool.getConnection((err, conn) => {
  if (err) {
    console.error('Database Failed:', err);
    return;
  }else {
    console.log('Connected to database');
    conn.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});