const express = require('express');
const { addContentCopyController } = require('../controllers/contentController');
const { getContent } = require('../controllers/contentController');
const { updateContentController } = require('../controllers/contentController');

const router = express.Router();

// Route to handle adding a content copy
router.post('/content', addContentCopyController);

// Route to fetch content based on subjects_id and matric
router.get('/content', getContent);

router.patch('/content', updateContentController);

module.exports = router;
