const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Initialization
const dbPath = path.join(__dirname, 'civicfix.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initDatabase();
  }
});

function initDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      locality TEXT NOT NULL,
      ward TEXT,
      category TEXT NOT NULL,
      description TEXT,
      photo_url TEXT,
      status TEXT DEFAULT 'Pending BMC Verification',
      grievance_id TEXT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Database initialized: issues table ready.');
    }
  });
}

// Routes
// 1. GET /issues - Retrieve all issues ordered by created_at DESC
app.get('/issues', (req, res) => {
  const query = `SELECT * FROM issues ORDER BY created_at DESC`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 2. POST /issues - Ingest a new issue
app.post('/issues', (req, res) => {
  const { locality, ward, category, description, photo_url } = req.body;

  if (!locality || !category) {
    return res.status(400).json({ error: 'Locality and category are required.' });
  }

  const insertQuery = `
    INSERT INTO issues (locality, ward, category, description, photo_url, status, grievance_id)
    VALUES (?, ?, ?, ?, ?, 'Pending BMC Verification', NULL)
  `;

  db.run(
    insertQuery,
    [
      locality,
      ward || null,
      category,
      description || null,
      photo_url || null,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const newId = this.lastID;
      // Fetch and return the newly created row
      db.get(`SELECT * FROM issues WHERE id = ?`, [newId], (fetchErr, row) => {
        if (fetchErr) {
          return res.status(201).json({
            id: newId,
            locality,
            ward,
            category,
            description,
            photo_url,
            status: 'Pending BMC Verification',
            grievance_id: null,
          });
        }
        res.status(201).json(row);
      });
    }
  );
});

// 3. PATCH /issues/:id - Update grievance_id and status to 'Officially Tracked'
app.patch('/issues/:id', (req, res) => {
  const issueId = req.params.id;
  const { grievance_id } = req.body;

  if (!grievance_id || !grievance_id.trim()) {
    return res.status(400).json({ error: 'grievance_id is required.' });
  }

  const trimmedGrievanceId = grievance_id.trim();
  const updateQuery = `
    UPDATE issues
    SET grievance_id = ?, status = 'Officially Tracked'
    WHERE id = ?
  `;

  db.run(updateQuery, [trimmedGrievanceId, issueId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: `Issue with id ${issueId} not found.` });
    }

    // Fetch and return updated issue
    db.get(`SELECT * FROM issues WHERE id = ?`, [issueId], (fetchErr, row) => {
      if (fetchErr) {
        return res.status(500).json({ error: fetchErr.message });
      }
      res.json(row);
    });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`CivicFix Backend Server listening on http://localhost:${PORT}`);
});
