const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const testDbRoutes = require('./routes/testDb');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middleware
// CORS middleware
app.use(
    cors({
      origin: process.env.CORS_ORIGIN.split(','), // پشتیبانی از چندین مبدا
      credentials: true,
    })
  );
app.use(bodyParser.json());

// انتخاب محیط (default: development)
const env = process.env.NODE_ENV || 'development';
console.log(`Running in ${env} mode`);

// مسیرهای مختلف
app.get('/', (req, res) => res.send('Backend is running!'));
app.use('/backend/testdb', testDbRoutes);
app.use('/backend/auth', authRoutes); // مسیر احراز هویت
app.use('/backend/tasks', taskRoutes); // مسیر مدیریت وظایف

// تنظیمات پورت
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
