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
  const { title, description, status } = req.body;
  if (!title || !description || !status) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const userId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, user_id, "order") 
       VALUES ($1, $2, $3, $4, (SELECT COALESCE(MAX("order"), 0) + 1 FROM tasks WHERE user_id = $4)) 
       RETURNING *`,
      [title.trim(), description.trim(), status, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /tasks:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// دریافت همه وظایف کاربر بر اساس ترتیب
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY "order" ASC', 
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error in GET /tasks:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// به‌روزرسانی ترتیب وظایف بعد از Drag & Drop
router.post('/reorder', authenticateToken, async (req, res) => {
  const updatedOrders = req.body;

  if (!Array.isArray(updatedOrders) || updatedOrders.length === 0) {
    return res.status(400).json({ error: 'Invalid task order data.' });
  }

  try {
    await pool.query('BEGIN');

    for (const { id, order } of updatedOrders) {
      await pool.query(
        'UPDATE tasks SET "order" = $1 WHERE id = $2 AND user_id = $3',
        [order, id, req.user.id]
      );
    }

    await pool.query('COMMIT');
    res.status(200).json({ message: 'Task order updated successfully' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error in POST /tasks/reorder:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ویرایش وظیفه
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (!title || !description || !status) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [title.trim(), description.trim(), status, id, req.user.id]
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

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

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
