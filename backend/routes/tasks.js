const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT, 10),
});
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Middleware برای احراز هویت
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token is missing.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Invalid token:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// افزودن وظیفه جدید
router.post('/', authenticateToken, async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const userId = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title.trim(), description.trim(), userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /tasks:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// دریافت همه وظایف کاربر
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error in GET /tasks:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ویرایش وظیفه
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const userId = req.user.id;

  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [title.trim(), description.trim(), id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error in PUT /tasks/:id:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// حذف وظیفه
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error in DELETE /tasks/:id:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
