const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Import routes
const testDbRoutes = require('./routes/testDb');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const codeRoutes = require('./routes/code');

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',').map(url => url.trim()) || '*',
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Determine environment
const env = process.env.NODE_ENV || 'development';
console.log(`Running in ${env} mode`);

// Routes
app.get('/', (req, res) => res.send('Backend is running!'));
app.use('/backend/testdb', testDbRoutes);
app.use('/backend/auth', authRoutes);
app.use('/backend/tasks', taskRoutes);
app.use('/backend/code', codeRoutes);

// Port configuration
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
