const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const logRoutes = require('./routes/log');
const testDbRoutes = require('./routes/testDb'); // اضافه شدن مسیر جدید

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// مسیرهای مختلف
app.get('/', (req, res) => res.send('Backend is running!'));
app.use('/log', logRoutes);
app.use('/backend/test-db', testDbRoutes); // اضافه شدن مسیر جدید

// تنظیمات پورت
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
