const express = require('express');
const { addContentCopyController } = require('../controllers/contentController');

const router = express.Router();

// Route to handle adding a content copy
router.post('/content', addContentCopyController);

module.exports = router;
