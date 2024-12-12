const express = require('express');
const sql = require('mssql');
const config = require('../dbconfig'); // Ensure this points to your DB configuration
const router = express.Router();

// POST route for login
router.post('/', async (req, res) => {
  try {
    await sql.connect(config);
    const { username, password } = req.body; // Get username and password from the request body

    // Use parameterized query to prevent SQL injection
    const result = await sql.query`
      SELECT * FROM users 
      WHERE username = ${username} AND password = ${password}`;
    console.log(result.recordset);
    if (result.recordset.length > 0) {
      // User found, login successful
      res.status(200).json({ message: 'Login successful', success: true });
    } else {
      // User not found or invalid credentials
      res.status(401).json({ message: 'Invalid username or password', success: false });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error', success: false });
  }
});

module.exports = router;
