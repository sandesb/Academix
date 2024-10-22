// src/utils/dbQueries.js (you can create this file for database queries)

const pool = require('../config/db');

async function getMessages() {
  try {
    const res = await pool.query('SELECT * FROM messages');
    return res.rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}

module.exports = { getMessages };
