const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// تنظیمات پایگاه داده
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// مسیر تست اتصال به پایگاه داده
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, timestamp: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; // اطمینان حاصل کنید که این خروجی صحیح است
