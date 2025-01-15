const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const config = require('../config');

// انتخاب محیط (default: development)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// تنظیمات پایگاه داده
const pool = new Pool(dbConfig.connection);

// مسیر تست اتصال به پایگاه داده
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, timestamp: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
