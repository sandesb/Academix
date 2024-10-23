const express = require("express");
const pool = require("./database/db"); // Database connection
const cors = require("cors");
const WebSocket = require("ws"); // WebSocket
const subjectsRoutes = require('./routes/subjects'); // Import the course routes
const contentRoutes = require('./routes/content'); // Import the content routes

const app = express();
app.use(cors());
app.use(express.json());

// WebSocket server setup
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected");
  ws.on("close", () => {
    console.log("Client disconnected");
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

app.use('/api', contentRoutes); // Register the content routes
app.use('/api', subjectsRoutes); // Use the course routes under the /api path
  

// Route to fetch all admin
app.get("/admin", async (req, res) => {
  try {
    // Query the database to get all admin
    const result = await pool.query("SELECT * FROM admin");
    res.json(result.rows); // Send the result as a JSON response
  } catch (err) {
    console.error("Error fetching admin:", err);
    res.status(500).json({ error: "Server error while fetching admin" });
  }
});

// Route to fetch all messages
app.get("/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Server error while fetching messages" });
  }
});

// Route to delete a message by its ID
app.delete("/messages/:id", async (req, res) => {
  const { id } = req.params; // Extract the message ID from the URL

  try {
    // Delete the message from the database
    const result = await pool.query(
      "DELETE FROM messages WHERE message_id = $1 RETURNING *",
      [id]
    );

    // Check if any rows were affected (if a message with the given ID existed)
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    // If successful, return the deleted message
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error deleting message:", err.message);
    res.status(500).json({ error: "Server error while deleting message" });
  }
});

// Route to add a new message
app.post("/messages", async (req, res) => {
  try {
    const { message_text, matric_no, student_name, is_admin, created_at } =
      req.body;

    if (!message_text || !matric_no || !student_name || !created_at) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert the new message into the database
    const newMessage = await pool.query(
      "INSERT INTO messages (message_text, matric_no, student_name, is_admin, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [message_text, matric_no, student_name, is_admin, created_at]
    );

    // Broadcast the newly added message to all WebSocket clients
    broadcastMessage(newMessage.rows[0]);

    res.json(newMessage.rows[0]);
  } catch (err) {
    console.error("Error adding message:", err.message);
    res.status(500).json({ error: "Server error while adding message" });
  }
});

// Route to fetch all students
app.get("/students", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM students ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Server error while fetching students" });
  }
});

// Route to fetch a student by ID
app.get("/students/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM students WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching student by ID:", err);
    res.status(500).json({ error: "Server error while fetching student" });
  }
});

// Route to add a new student
app.post("/students", async (req, res) => {
  const { matric, name, semester, email } = req.body;

  if (!matric || !name || !semester || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO students (matric, name, semester, email, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [matric, name, semester, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding student:", err.message);
    res.status(500).json({ error: "Server error while adding student" });
  }
});

// Route to update a student by ID
app.put("/students/:id", async (req, res) => {
  const { id } = req.params;
  const { matric, name, semester, email } = req.body;

  if (!matric || !name || !semester || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      "UPDATE students SET matric = $1, name = $2, semester = $3, email = $4 WHERE id = $5 RETURNING *",
      [matric, name, semester, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating student:", err.message);
    res.status(500).json({ error: "Server error while updating student" });
  }
});

// Route to delete a student by ID
app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error deleting student:", err.message);
    res.status(500).json({ error: "Server error while deleting student" });
  }
});

// Route to fetch all repositories
app.get("/repositories", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT matric, id, title, source_name, image_url, abstract, project_report_url, tech_stack FROM repositories ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching repositories:", err);
    res.status(500).json({ error: "Server error while fetching repositories" });
  }
});

// Route to fetch a repository by ID
app.get("/repositories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, matric, title, abstract, source_name, image_url, project_source_code_url, project_report_url, tech_stack FROM repositories WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Repository not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching repository by ID:", err);
    res.status(500).json({ error: "Server error while fetching repository" });
  }
});

// Route to add a new repository
app.post("/repositories", async (req, res) => {
  const {
    title,
    source_name,
    image_url,
    abstract,
    matric,
    project_report_url,
    project_source_code_url,
    tech_stack,
  } = req.body;

  // Log the received data
  console.log("Received data:", req.body);

  // Check if required fields are missing
  if (!title || !matric || !project_report_url || !project_source_code_url) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO repositories 
      (title, source_name, image_url, abstract, matric, project_report_url, project_source_code_url, tech_stack, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
      RETURNING *`,
      [
        title,
        source_name,
        image_url,
        abstract,
        matric,
        project_report_url,
        project_source_code_url,
        tech_stack,
      ]
    );

    console.log("Repository added:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding repository:", err); // Log full error object
    res.status(500).json({ error: "Server error while adding repository" });
  }
});

// Route to update a repository by ID
app.put("/repositories/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    source_name,
    image_url,
    abstract,
    matric,
    project_report_url,
    project_source_code_url,
    tech_stack,
  } = req.body;

  if (!title || !matric || !project_report_url || !project_source_code_url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `UPDATE repositories 
       SET title = $1, source_name = $2, image_url = $3, abstract = $4, matric = $5, project_report_url = $6, project_source_code_url = $7
       WHERE id = $8 RETURNING *`,
      [
        title,
        source_name,
        image_url,
        abstract,
        matric,
        project_report_url,
        project_source_code_url,
        tech_stack,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Repository not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating repository:", err.message);
    res.status(500).json({ error: "Server error while updating repository" });
  }
});

// Route to delete a repository by ID
app.delete("/repositories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM repositories WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Repository not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error deleting repository:", err.message);
    res.status(500).json({ error: "Server error while deleting repository" });
  }
});





// WebSocket server upgrade for HTTP connections
const server = app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


