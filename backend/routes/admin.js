const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/login', adminController.loginAdmin); // Use GET method as requested

module.exports = router;
