const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const logRoutes = require('./routes/log');
const testDbRoutes = require('./routes/testDb');
const config = require('./config'); // اضافه کردن فایل تنظیمات

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// انتخاب محیط (default: development)
const env = process.env.NODE_ENV || 'development';
console.log(`Running in ${env} mode`);

// مسیرهای مختلف
app.get('/', (req, res) => res.send('Backend is running!'));
app.use('/log', logRoutes);
app.use('/backend/test-db', testDbRoutes);

// تنظیمات پورت
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
