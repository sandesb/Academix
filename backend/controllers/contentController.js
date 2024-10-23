const { addContentCopy } = require('../models/contentModel');
const { updateContent } = require('../models/contentModel');
const { fetchContent } = require('../models/contentModel');
const pool = require('../database/db');

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

// Controller function to get content
const getContent = async (req, res) => {
    const { subjects_id, matric } = req.query;
    try {
      // Call the fetchContent function from the model
      const content = await fetchContent(subjects_id, matric);
      console.log('Fetched content:', content);
  
      res.status(200).json(content);
    } catch (error) {
      console.error('Error fetching content:', error);
      res.status(500).json({ error: 'Failed to fetch content' });
    }
  };

 

// Controller to handle content update
const updateContentController = async (req, res) => {
    const { content_id, subjects_id, matric, note, name } = req.body;
  
    // Add console logs for debugging
    console.log('Received PATCH request for content update with data:', req.body);
  
    try {
      const updatedContent = await updateContent(content_id, subjects_id, matric, note, name);
      console.log('Successfully updated content:', updatedContent);
      res.status(200).json(updatedContent); // Send back the updated content
    } catch (error) {
      console.error('Error updating content:', error);
      res.status(500).json({ error: 'Failed to update content' });
    }
  };
  

module.exports = { addContentCopyController, getContent, updateContentController };
