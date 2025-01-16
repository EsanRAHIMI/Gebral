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
  port: process.env.DB_PORT,
});
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Middleware برای احراز هویت
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Invalid token:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.log('Token verified, user:', user);
    req.user = user;
    next();
  });
};

// افزودن وظیفه جدید
router.post('/', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  console.log('Incoming data:', { title, description, userId });

  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, userId]
    );
    console.log('Task added successfully:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /tasks:', err.message, err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// دریافت همه وظایف کاربر
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  console.log('Fetching tasks for user ID:', userId);

  try {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    console.log('Fetched tasks:', result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error in GET /tasks:', err.message, err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ویرایش وظیفه
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;

  console.log('Updating task:', { id, title, description, userId });

  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, description, id, userId]
    );
    if (result.rows.length === 0) {
      console.error('Task not found for update');
      return res.status(404).json({ error: 'Task not found' });
    }
    console.log('Task updated successfully:', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error in PUT /tasks/:id:', err.message, err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// حذف وظیفه
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  console.log('Deleting task:', { id, userId });

  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
    if (result.rowCount === 0) {
      console.error('Task not found for deletion');
      return res.status(404).json({ error: 'Task not found' });
    }
    console.log('Task deleted successfully');
    res.status(204).send();
  } catch (err) {
    console.error('Error in DELETE /tasks/:id:', err.message, err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
