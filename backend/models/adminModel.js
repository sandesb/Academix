const pool = require('../database/db');

const getAdminByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
  return res.rows[0];
};

module.exports = { getAdminByEmail };
