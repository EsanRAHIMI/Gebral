const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const config = require('../config');

// بررسی مقدار تنظیمات پایگاه داده
if (!config || !config.connection) {
  throw new Error('Database configuration is missing or incorrect');
}

// تنظیمات پایگاه داده
const pool = new Pool(config.connection);

// مسیر تست اتصال به پایگاه داده
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, timestamp: result.rows[0].now });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
