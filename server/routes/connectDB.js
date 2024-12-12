// db.js
const sql = require('mssql');
const config = require('./config'); // Your database configuration

let pool;

// Create and export the pool connection
const connectDB = async () => {
  try {
    // Establish the database connection pool
    pool = await sql.connect(config);
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
};

// Export the pool and connectDB function
module.exports = {
  connectDB,
  getPool: () => pool, // You can access the pool through this method
};
