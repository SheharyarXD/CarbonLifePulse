const { Pool } = require('pg');
require('dotenv').config(); // If using dotenv to load your .env file

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // Handling SSL
});

pool.connect()
    .then(() => console.log('Connected to the database successfully!'))
    .catch((err) => console.error('Error connecting to the database:', err.stack));

module.exports = pool;
