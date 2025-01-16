const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const logRoutes = require('./routes/log');
const testDbRoutes = require('./routes/testDb');
const config = require('./config'); // اضافه کردن فایل تنظیمات
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks'); // اضافه کردن مسیر وظایف
const logs = []; // آرایه‌ای برای ذخیره لاگ‌ها

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express(); // تعریف متغیر app قبل از استفاده

// Middleware
app.use(cors());
app.use(bodyParser.json());

// انتخاب محیط (default: development)
const env = process.env.NODE_ENV || 'development';
console.log(`Running in ${env} mode`);

// مسیرهای مختلف
app.get('/', (req, res) => res.send('Backend is running!'));
app.use('/backend/test-db', testDbRoutes); // مسیر تست دیتابیس

app.use('/auth', authRoutes); // مسیر احراز هویت
app.use('/log', logRoutes); // مسیر لاگ‌ها
app.use('/tasks', taskRoutes); // مسیر مدیریت وظایف

// Middleware برای ذخیره لاگ‌ها
app.use((req, res, next) => {
  const log = `${req.method} ${req.url} - ${new Date().toISOString()}`;
  logs.push(log); // ذخیره لاگ
  console.log(log); // نمایش لاگ در کنسول
  next();
});

// مسیر نمایش لاگ‌ها
app.get('/logs', (req, res) => {
  res.json(logs); // ارسال لاگ‌ها به مرورگر
});

// تنظیمات پورت
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
