// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

// Using GET method as requested
router.get('/login', adminController.login.bind(adminController));

module.exports = router;
