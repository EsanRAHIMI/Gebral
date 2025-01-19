require('dotenv').config();

const sharedConfig = {
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
  },
};

const env = process.env.NODE_ENV?.trim() || 'development';

const config = {
  development: {
    ...sharedConfig,
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'esan',
      password: process.env.DB_PASS || 'IRan8813ch564._',
      database: process.env.DB_NAME || 'gabriel_dev',
    },
  },
  production: {
    ...sharedConfig,
    connection: {
      host: process.env.DB_HOST || 'gebral-db-rlwxdk',
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'esan',
      password: process.env.DB_PASS || 'IRan8813ch564._',
      database: process.env.DB_NAME || 'gabriel',
    },
  },
};

if (!config[env]) {
  throw new Error(`Invalid NODE_ENV value: ${env}`);
}

console.log(`Running in ${env} mode`);
module.exports = config[env];
