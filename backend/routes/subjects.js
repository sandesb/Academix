const express = require('express');
const {
  addSubjectsController,
  getSubjectsController,
  updateSubjectController,
  deleteSubjectController,
  fetchAllSubjectsController, // Import the new controller
} = require('../controllers/subjectsController');

const router = express.Router();

// Fetch all subjects
router.get('/all-subjects', fetchAllSubjectsController); // New route to fetch all subjects

// Fetch subjects with optional matric filtering
router.get('/subjects', getSubjectsController);

// Add a new subject
router.post('/add-subjects', addSubjectsController);

// Update a subject by ID using PATCH
router.patch('/subjects/:id', updateSubjectController);

// Delete a subject by ID
router.delete('/subjects/:id', deleteSubjectController);

module.exports = router;
