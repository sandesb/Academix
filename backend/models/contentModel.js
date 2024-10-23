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

// Fetch content based on subjects_id and matric
const fetchContent = async (subjects_id, matric) => {
    let query = 'SELECT * FROM content WHERE subjects_id = $1';
    const values = [subjects_id];
  
    // Add matric filtering
    if (matric && matric.startsWith('eq.')) {
      const matricValue = matric.replace('eq.', '');
      query += ' AND matric = $2';
      values.push(matricValue);
    } else if (matric === 'matric=is.null') {
      query += ' AND matric IS NULL';
    }
  
    // Log the query for debugging purposes
    console.log('Executing SQL query:', query);
    console.log('Query values:', values);
  
    const result = await pool.query(query, values);
    return result.rows;
  };

// Update content based on content_id, subjects_id, and matric
const updateContent = async (content_id, subjects_id, matric, note, name) => {
    console.log('Executing SQL query to update content:');
    console.log('content_id:', content_id);
    console.log('subjects_id:', subjects_id);
    console.log('matric:', matric);
    console.log('note:', note);
    console.log('name:', name);
  
    const query = `
      UPDATE content
      SET note = $1, name = $2
      WHERE content_id = $3 AND subjects_id = $4 AND matric = $5
      RETURNING *;
    `;
    const values = [note, name, content_id, subjects_id, matric];
  
    const result = await pool.query(query, values);
    console.log('SQL query result:', result.rows[0]);
    return result.rows[0]; // Return the updated row
  };

module.exports = { addContentCopy, fetchContent, updateContent };
