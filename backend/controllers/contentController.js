const { addContentCopy } = require('../models/contentModel');

// Controller to handle adding content and subject copy
const addContentCopyController = async (req, res) => {
  const newContent = req.body;

  try {
    // Insert content and subject into the database
    const { insertedContent, insertedSubject } = await addContentCopy(newContent);

    // Send success response
    res.status(201).json({ content: insertedContent, subject: insertedSubject });
  } catch (error) {
    console.error('Error adding content copy:', error);
    res.status(500).json({ error: 'Failed to add content copy', details: error.message });
  }
};

module.exports = { addContentCopyController };
