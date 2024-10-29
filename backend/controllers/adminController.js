const {generateAccessToken, generateRefreshToken} = require('../utils/tokenUtil.js')
const adminModel = require('../models/adminModel');

const loginAdmin = async (req, res) => {
    const { email, password } = req.query;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    try {
      const admin = await adminModel.getAdminByEmail(email);
  
      if (!admin || admin.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const accessToken = generateAccessToken({ email: admin.email });
      const refreshToken = generateRefreshToken({ email: admin.email });
  
      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  };
  

module.exports = { loginAdmin };
