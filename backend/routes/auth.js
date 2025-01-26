const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// تابع تولید شناسه یونیک بر اساس نام
const generateUniqueId = async (name) => {
  let baseId = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  let uniqueId = baseId;
  let count = 1;

  while (true) {
    const result = await pool.query('SELECT COUNT(*) FROM users WHERE id = $1', [uniqueId]);
    if (parseInt(result.rows[0].count) === 0) {
      break; // شناسه یونیک است
    }
    uniqueId = `${baseId}-${count}`;
    count++;
  }

  return uniqueId;
};

// ثبت نام کاربر جدید
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const uniqueUserId = await generateUniqueId(name);
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (id, email, password, name) VALUES ($1, $2, $3, $4)',
      [uniqueUserId, email, hashedPassword, name]
    );

    res.status(201).json({ message: 'User registered successfully.', id: uniqueUserId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ورود کاربر
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user: { id: user.id, name: user.name } });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// مسیر محافظت‌شده برای بررسی اعتبار کاربر
router.get('/protected', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json({ message: 'Access granted!', user: decoded });
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
});

// تغییر شناسه کاربر توسط خودش
router.put('/update-id', async (req, res) => {
  const { newId } = req.body;
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // بررسی اگر شناسه جدید قبلا ثبت شده باشد
    const existingId = await pool.query('SELECT * FROM users WHERE id = $1', [newId]);
    if (existingId.rows.length > 0) {
      return res.status(400).json({ error: 'This ID is already taken.' });
    }

    await pool.query('UPDATE users SET id = $1 WHERE id = $2', [newId, decoded.id]);

    res.status(200).json({ message: 'User ID updated successfully.', id: newId });
  } catch (error) {
    res.status(400).json({ error: 'Invalid token or request.' });
  }
});

// دریافت اطلاعات کاربر با استفاده از توکن
router.get('/profile', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [decoded.id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user.rows[0]);
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
});

module.exports = router;
