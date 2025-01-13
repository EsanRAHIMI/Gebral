
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
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