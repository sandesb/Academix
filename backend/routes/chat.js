// src/routes/chatRoutes.js
const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/complete', chatController.getChatResponse);

module.exports = router;
