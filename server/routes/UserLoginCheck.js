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
// router.post(
//   "/login",
//   [
//     body("username").notEmpty().isNumeric().withMessage("Username must be numeric"),
//     body("password").notEmpty().withMessage("Password cannot be empty"),
//   ],
  
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     console.log("usercheck");
//       const { username, password } = req.body;

//     try {
//       // Step 1: Call the external API
//       const apiResponse = await axios.post("http://192.168.101.13:5202/hn_login", {
//         user_id: username,
//         password: password,
//       });

//       // Check API response status
//       if (apiResponse.data.login_status === "1") {
//         // Step 2: Fetch employee name from the database
//         await sql.connect(config);
//         const query = "SELECT t_nama FROM ttccom0019001 WHERE t_emno = @id";
//         const request = new sql.Request();
//         const result = await request.input("id", sql.VarChar, username).query(query);

//         if (result.recordset.length > 0) {
//           const name = result.recordset[0].t_nama;

//           // Step 3: Create session
//           req.session.user = { id: username, name: name };

//           // Step 4: Send success response
//           return res.status(200).json({
//             status: "1",
//             message: "Login successful",
//             name: name,
//           });
//         } else {
//           return res.status(404).json({
//             status: "0",
//             message: "User not found in the database",
//           });
//         }
//       } else {
//         return res.status(401).json({
//           status: "0",
//           message: "Invalid credentials",
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       return res.status(500).json({
//         status: "0",
//         message: "Internal server error",
//       });
//     }
//   }
// );
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

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
  
    
    const { username, password } = req.body;
    console.log("Step 1: Received request", req.body);
    try {
      // Step 1: Call the external API
      const apiResponse = await axios.post("http://192.168.101.13:5202/hn_login", {
        user_id: username,
        password: password,
      });
      console.log("Step 2: External API response", apiResponse.data);
      if (apiResponse.data.login_status === "1") {
        // Step 2: Fetch employee name from the database
        await sql.connect(config);
        const query = "SELECT t_nama FROM ttccom0019001 WHERE t_emno = @id";
        const request = new sql.Request();
        const result = await request.input("id", sql.VarChar, username).query(query);
        console.log("Step 3: Database query result", result.recordset);
        if (result.recordset.length > 0) {
          const name = result.recordset[0].t_nama;

          let token; // Declare token outside the try block
try {
  token = jwt.sign({ id: username, name: name }, secretKey, {
    expiresIn: "1h",
  });
  console.log("Generated Token:", token);
} catch (error) {
  console.error("JWT Error:", error.message);
  return res.status(500).json({ status: "0", message: "Token generation failed" });
}

          
          
          console.log("JWT Token generated:", token);
          console.log("sucess login");
          return res.status(200).json({
            status: "1",
            message: "Login successful",
            token: token, // Send the token to the frontend
          });
        } else {
          return res.status(404).json({ status: "0", message: "User not found" });
        }
      } else {
        return res.status(401).json({ status: "0", message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ status: "0", message: "Internal server error" });
    }
  }
);

router.post('/logout', async (req, res) => {
  try {
    const { userId, username, loginTime } = req.body;
    console.log(userId+" "+username+" "+loginTime);
    // console.log({
    //   userId: user.id,
    //   username: user.name,
    //   loginTime: loginTime,
    // });
    
    const logoutTime = new Date();

    // Check if loginTime is valid
    if (!loginTime || isNaN(new Date(loginTime))) {
      return res.status(400).json({ error: 'Invalid login time' });
    }

    // Calculate activity duration in seconds
    const activityDuration = Math.floor((logoutTime - new Date(loginTime)) / 1000);

    // Format activity duration as HH:MM:SS
    const hours = String(Math.floor(activityDuration / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((activityDuration % 3600) / 60)).padStart(2, '0');
    const seconds = String(activityDuration % 60).padStart(2, '0');
    const formattedDuration = `${hours}:${minutes}:${seconds}`;

    await sql.connect(config);

    // Insert session data into MySQL
    const query = `
      INSERT INTO session_logs (user_id, username, login_time, logout_time, activity_duration)
      VALUES (?, ?, ?, ?, ?)`;

    sql.query(
      query,
      [userId, username, loginTime, logoutTime, formattedDuration],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to store session data' });
        }
        res.status(200).json({ message: 'Session stored successfully' });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  
router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const results = await db.query(`
      SELECT t_emno, t_nama 
      FROM ttccom0019001 
      WHERE t_emno LIKE $1 OR t_nama LIKE $2
    `, [`%${query}%`, `%${query}%`]);
    res.json(results.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
