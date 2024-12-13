// server.js
const express = require('express');
const app = express();
const cors = require('cors'); 
const bodyParser = require('body-parser'); // Optional, but express.json() is sufficient
const UserLoginRoute = require('./routes/UserLoginCheck');
// Middleware to parse JSON request bodies
app.use(express.json()); 
// const sqlRoutes = require('./routes/AssetListRoutes'); // Import the route file
const sqlRoutes = require('./routes/SqlRoutes');
const loginRoute = require('./routes/LoginCheck');
const IssuesCheck = require('./routes/IssuesCheck');
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests only from this origin
}));

// Use the routes
app.use('/assets',sqlRoutes); // Prefix all routes with /api

app.use('/login', loginRoute);
//Default route
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});
// app.get('/issues',IssuesCheck)
app.use('/issues', IssuesCheck);
app.use('/user',UserLoginRoute);
// Start server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});








// const express = require('express');
// const cors = require('cors');
// const sql = require('mssql/msnodesqlv8');
// const dotenv = require('dotenv');

// // Load environment variables
// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// const config = {
//     user: process.env.DB_USER,  // SQL Server username
//     password: process.env.DB_PASS,  // SQL Server password
//     server: process.env.DB_HOST,  // SQL Server host (e.g., localhost or your server name)
//     database: process.env.DB_NAME,  // SQL Server database name
//     port: parseInt(process.env.DB_PORT, 10) || 1433,  // SQL Server port (default 1433)
//     options: {
//         encrypt: false,  // Disable encryption for local dev (use true if in production)
//         trustServerCertificate: true,  // Allow self-signed certificates
//     },
// };
// console.log( process.env.DB_NAME);
// // Test SQL Server Connection
// sql.connect(config)
//   .then(() => console.log('Connected to SQL Server'))
//   .catch(err => {
//     console.error('Connection Error:', err);
//     if (err.code === 'ETIMEOUT') {
//       console.error('Timeout: Check host, port, or firewall.');
//     }
//   });

// // Endpoint to Fetch All Assets
// app.get('/assets', async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request().query('SELECT * FROM ttxtvs1109001');
//     res.json(result.recordset);  // Send the rows as JSON
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).send('Server Error');
//   }
// });

// // Server Port Configuration
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
