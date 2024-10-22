// backend/db.js
require('dotenv').config();  // Load .env file

const { Pool } = require('pg');

// Create a new pool instance for database connection
const pool = new Pool({
  user: process.env.PG_USER || 'your_db_user',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'academix',
  password: process.env.PG_PASSWORD || 'your_db_password',
  port: process.env.PG_PORT || 5432,
});

module.exports = pool;
