const express = require('express');
const pool = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

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