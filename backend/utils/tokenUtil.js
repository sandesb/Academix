const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (admin) => {
  const token = jwt.sign(admin, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
  console.log('Generated Access Token:', token);
  console.log('Access Token Expiry:', process.env.ACCESS_TOKEN_EXPIRY);
  return token;
};

const generateRefreshToken = (admin) => {
  const token = jwt.sign(admin, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
  console.log('Generated Refresh Token:', token);
  console.log('Refresh Token Expiry:', process.env.REFRESH_TOKEN_EXPIRY);
  return token;
};

module.exports = { generateAccessToken, generateRefreshToken };
