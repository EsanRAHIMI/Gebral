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
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
  },
  production: {
    ...sharedConfig,
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
  },
};

if (!config[env]) {
  throw new Error(`Invalid NODE_ENV value: ${env}`);
}

//console.log(`Running in ${env} mode`);
module.exports = config[env];
