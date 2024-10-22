const express = require('express');
const pool = require('./db'); // Database connection
const cors = require('cors');
const WebSocket = require('ws'); // WebSocket

const app = express();
app.use(cors());
app.use(express.json());

// WebSocket server setup
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Function to broadcast a message to all connected WebSocket clients
const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message)); // Broadcast to all clients
    }
  });
};

console.log('Database Config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,  // Check if this outputs the correct user
    password: process.env.DB_PASSWORD  // Ensure the password is not undefined or empty
  });
  
// Route to fetch all messages
app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Server error while fetching messages' });
  }
});

// Route to delete a message by its ID
app.delete('/messages/:id', async (req, res) => {
    const { id } = req.params; // Extract the message ID from the URL
  
    try {
      // Delete the message from the database
      const result = await pool.query('DELETE FROM messages WHERE message_id = $1 RETURNING *', [id]);
  
      // Check if any rows were affected (if a message with the given ID existed)
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      // If successful, return the deleted message
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error deleting message:', err.message);
      res.status(500).json({ error: 'Server error while deleting message' });
    }
  });
  

// Route to add a new message
app.post('/messages', async (req, res) => {
  try {
    const { message_text, matric_no, student_name, is_admin, created_at } = req.body;

    if (!message_text || !matric_no || !student_name || !created_at) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert the new message into the database
    const newMessage = await pool.query(
      'INSERT INTO messages (message_text, matric_no, student_name, is_admin, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [message_text, matric_no, student_name, is_admin, created_at]
    );

    // Broadcast the newly added message to all WebSocket clients
    broadcastMessage(newMessage.rows[0]);

    res.json(newMessage.rows[0]);
  } catch (err) {
    console.error('Error adding message:', err.message);
    res.status(500).json({ error: 'Server error while adding message' });
  }
});

// WebSocket server upgrade for HTTP connections
const server = app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
