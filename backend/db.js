const { Pool } = require('pg');
require('dotenv').config(); // If using dotenv to load your .env file

const pool = new Pool({
  user: 'CarbonCalculator_owner',           // Hardcoded database user
  host: 'ep-dark-morning-a547yy53.us-east-2.aws.neon.tech',  // Hardcoded Neon DB host
  database: 'CarbonCalculator',             // Hardcoded database name
  password: '6xoWM8hfHFPO',                 // Hardcoded database password
  port: 5432,                               // Port for PostgreSQL
  ssl: { rejectUnauthorized: true }         // SSL configuration for secure connection
});

pool.connect()
    .then(() => console.log('Connected to the database successfully!'))
    .catch((err) => console.error('Error connecting to the database:', err.stack));

module.exports = pool;
