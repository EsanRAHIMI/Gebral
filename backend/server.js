const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// بارگذاری متغیرهای محیطی
dotenv.config();

// فعال کردن Cors و Body Parser
app.use(cors());
app.use(bodyParser.json());

// اتصال به پایگاه داده
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// مسیر اصلی برای بررسی وضعیت سرور
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// مسیر تست اتصال به پایگاه داده
app.get('/backend/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // اجرای کوئری ساده برای دریافت زمان
    res.json({ success: true, timestamp: result.rows[0].now }); // ارسال نتیجه به کلاینت
  } catch (error) {
    res.status(500).json({ success: false, error: error.message }); // ارسال خطا به کلاینت
  }
});


// تنظیمات پورت و شروع سرور
const PORT = process.env.PORT || 5001; // مقدار پیش‌فرض برای پورت