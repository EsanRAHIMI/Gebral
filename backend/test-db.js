const { Pool } = require('pg');
const config = require('./config');

// انتخاب محیط (default: development)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const pool = new Pool(dbConfig.connection);

(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database Connected:', result.rows[0]);
  } catch (error) {
    console.error('Database Connection Error:', error.message);
  } finally {
    pool.end();
  }
})();
