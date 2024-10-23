const pool = require('../database/db');

// Function to insert content into the content and subjects table
const addContentCopy = async (newContent) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Begin the transaction

    // Insert into the content table
    const contentQuery = `
      INSERT INTO content (subjects_id, name, note, matric)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const contentValues = [
      newContent.subjects_id,
      newContent.name,
      newContent.note,
      newContent.matric,
    ];

    const contentResult = await client.query(contentQuery, contentValues);
    const insertedContent = contentResult.rows[0];

    // Prepare data for the subjects table insertion
    const subjectsQuery = `
      INSERT INTO subjects (id, title, matric, progress, icon, bgColor)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const subjectsValues = [
      newContent.subjects_id,  // Use the same subject ID
      newContent.name,         // Subject's title/name
      newContent.matric,       // Set the matric number (can be 'GUEST', null, or actual matric number)
      '0 / X',                 // Default progress (you can adjust this dynamically)
      '📚',                    // Default icon
      'from-blue-100 to-blue-300' // Default background color
    ];

    const subjectsResult = await client.query(subjectsQuery, subjectsValues);
    const insertedSubject = subjectsResult.rows[0];

    await client.query('COMMIT'); // Commit the transaction

    return { insertedContent, insertedSubject };
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback if any error occurs
    throw new Error('Error inserting content and subject: ' + error.message);
  } finally {
    client.release();
  }
};

module.exports = { addContentCopy };
