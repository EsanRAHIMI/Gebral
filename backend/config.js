require('dotenv').config(); // بارگذاری متغیرهای محیطی از .env

const sharedConfig = {
  pool: {
    max: 10, // حداکثر تعداد اتصال
    min: 2, // حداقل تعداد اتصال
    idleTimeoutMillis: 30000, // زمان انتظار برای آزادسازی اتصال
  },
};

module.exports = {
  development: {
    ...sharedConfig,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
  },
  production: {
    ...sharedConfig,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
  },
};
