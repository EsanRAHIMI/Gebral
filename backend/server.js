const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

const testDbRoutes = require('./routes/testDb');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const codeRoutes = require('./routes/code');

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN.split(','), 
    credentials: true,
}));
app.use(bodyParser.json());

// انتخاب محیط (default: development)
const env = process.env.NODE_ENV || 'development';
console.log(`Running in ${env} mode`);

// مسیرهای مختلف
app.get('/', (req, res) => res.send('Backend is running!'));
app.use('/backend/testdb', testDbRoutes);
app.use('/backend/auth', authRoutes);
app.use('/backend/tasks', taskRoutes);
app.use('/backend/code', codeRoutes);  // مسیر نمایش کدها

// تنظیمات پورت
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
