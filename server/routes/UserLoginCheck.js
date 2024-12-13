const express = require("express");
const session = require("express-session");
const sql = require("mssql");
const axios = require("axios");
const router = express.Router();
const config = require('../dbconfig');
const { body, validationResult } = require("express-validator");

require("dotenv").config(); // Load environment variables


router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
//  console.log("Session ID:", req.sessionID);
// Login Route
router.post(
  "/login",
  [
    body("username").notEmpty().isNumeric().withMessage("Username must be numeric"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("usercheck");
      const { username, password } = req.body;

    try {
      // Step 1: Call the external API
      const apiResponse = await axios.post("http://192.168.101.13:5202/hn_login", {
        user_id: username,
        password: password,
      });

      // Check API response status
      if (apiResponse.data.login_status === "1") {
        // Step 2: Fetch employee name from the database
        await sql.connect(config);
        const query = "SELECT t_nama FROM ttccom0019001 WHERE t_emno = @id";
        const request = new sql.Request();
        const result = await request.input("id", sql.VarChar, username).query(query);

        if (result.recordset.length > 0) {
          const name = result.recordset[0].t_nama;

          // Step 3: Create session
          req.session.user = { id: username, name: name };

          // Step 4: Send success response
          return res.status(200).json({
            status: "1",
            message: "Login successful",
            name: name,
          });
        } else {
          return res.status(404).json({
            status: "0",
            message: "User not found in the database",
          });
        }
      } else {
        return res.status(401).json({
          status: "0",
          message: "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        status: "0",
        message: "Internal server error",
      });
    }
  }
);

// Logout Endpoint
router.post('/logout', (req, res) => {
    const { userId, username, loginTime } = req.body;
    const logoutTime = new Date();
  
    // Calculate activity duration
    const activityDuration = Math.floor((logoutTime - new Date(loginTime)) / 1000); // Duration in seconds
  
    // Insert session data into MySQL
    const query = `
      INSERT INTO session_logs (user_id, username, login_time, logout_time, activity_duration)
      VALUES (?, ?, ?, ?, ?)`;
  
    db.execute(
      query,
      [userId, username, loginTime, logoutTime, new Date(activityDuration * 1000).toISOString().substr(11, 8)],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to store session data' });
        }
        res.status(200).json({ message: 'Session stored successfully' });
      }
    );
  });
  
module.exports = router;
