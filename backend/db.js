
require('dotenv').config();
const { Pool } = require('pg');

// Create a single pool instance
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000,
});
pool.connect((err, client, release) => {
  if (err) {
      console.error('Error connecting to the database:', err.stack);
  } else {
      console.log('Connected to the database successfully!');
  }
  release();
});
module.exports = pool;
