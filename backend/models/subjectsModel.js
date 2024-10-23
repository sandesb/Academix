const pool = require('../database/db');

// Insert a new subjects into the subjects and content tables
const addSubjects = async (subjects) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Insert into subjects table
    const insertSubjectsQuery = `
      INSERT INTO subjects (id, title, progress, icon, bgColor, matric)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await client.query(insertSubjectsQuery, [
      subjects.id,
      subjects.title,
      subjects.progress,
      subjects.icon,
      subjects.bgColor,
      subjects.matric
    ]);

    // Insert into content table
    const insertContentQuery = `
      INSERT INTO content (content_id, subjects_id, name, matric, note)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await client.query(insertContentQuery, [
      subjects.content_id,
      subjects.id, // Use the same subjects_id from the subjects table
      subjects.title,
      subjects.matric,
      subjects.note,
    ]);

    await client.query('COMMIT');
    return { message: 'Subjects added successfully!' };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during transaction:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { addSubjects }; // Make sure this is exported
