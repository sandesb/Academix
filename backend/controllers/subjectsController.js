const { addSubjects } = require('../models/subjectsModel');
const pool = require('../database/db');

// Function that handles adding a subject
const addSubjectsController = async (req, res) => {
  const subject = req.body;

  try {
    const response = await addSubjects(subject); // This should call the function correctly
    res.status(201).json(response);
  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(500).json({ error: 'Failed to add subject', details: error.message });
  }
};

// Fetch subjects with optional matric filtering
const getSubjectsController = async (req, res) => {
    const { matric } = req.query;
  
    try {
      let query = 'SELECT * FROM subjects';
      let values = [];
  
      // Log the matric value for debugging
      console.log('Matric value received:', matric);
  
      // Handle matric filtering
      if (matric && matric !== 'GUEST') {
        const matricValue = matric.replace('eq.', ''); // Remove 'eq.' from the matric value
        query += ' WHERE matric = $1';
        values = [matricValue];
      }
  
      // Log the SQL query and values for debugging
      console.log('Query:', query);
      console.log('Values:', values);
  
      const result = await pool.query(query, values);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ error: 'Failed to fetch subjects' });
    }
  };


// Update a subject by ID using PATCH
const updateSubjectController = async (req, res) => {
    const { id } = req.params;
    const { title, progress, icon, bgColor, matric, note } = req.body;
  
    try {
      // Fetch the current subject to preserve existing values if they are not provided in the request
      const currentSubject = await pool.query('SELECT * FROM subjects WHERE id = $1', [id]);
  
      if (currentSubject.rows.length === 0) {
        return res.status(404).json({ error: 'Subject not found' });
      }
  
      const existingSubject = currentSubject.rows[0];
  
      // Update only the fields that are provided, preserving others
      const updatedSubject = {
        title: title || existingSubject.title,
        progress: progress || existingSubject.progress,
        icon: icon || existingSubject.icon,
        bgColor: bgColor || existingSubject.bgColor,
        matric: matric || existingSubject.matric, // Preserve matric if not provided
        note: note || existingSubject.note,
      };
  
      const query = `
        UPDATE subjects
        SET title = $1, progress = $2, icon = $3, bgColor = $4, matric = $5, note = $6
        WHERE id = $7
      `;
      const values = [updatedSubject.title, updatedSubject.progress, updatedSubject.icon, updatedSubject.bgColor, updatedSubject.matric, updatedSubject.note, id];
  
      await pool.query(query, values);
      res.status(200).json({ message: 'Subject updated successfully' });
    } catch (error) {
      console.error('Error updating subject:', error);
      res.status(500).json({ error: 'Failed to update subject' });
    }
  };
  

// Delete a subject by ID
const deleteSubjectController = async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = 'DELETE FROM subjects WHERE id = $1';
      await pool.query(query, [id]);
  
      res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
      console.error('Error deleting subject:', error);
      res.status(500).json({ error: 'Failed to delete subject' });
    }
  };
  
  // Fetch all subjects without filtering
const fetchAllSubjectsController = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM subjects');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ error: 'Failed to fetch subjects' });
    }
  };
  

  
  

module.exports = { addSubjectsController, getSubjectsController, updateSubjectController, deleteSubjectController,   fetchAllSubjectsController, // Export the new controller
};
