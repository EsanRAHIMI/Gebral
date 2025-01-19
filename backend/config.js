require('dotenv').config(); // بارگذاری متغیرهای محیطی از .env

const sharedConfig = {
  pool: {
    max: 10, // حداکثر تعداد اتصال
    min: 2, // حداقل تعداد اتصال
    idleTimeoutMillis: 30000, // زمان انتظار برای آزادسازی اتصال
  },
};

// تعیین محیط جاری: اگر NODE_ENV تعریف نشده باشد، مقدار پیش‌فرض 'development' را استفاده می‌کند
const env = process.env.NODE_ENV?.trim() || 'development';

const config = {
  development: {
    ...sharedConfig,
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'esan',
      password: process.env.DB_PASS || 'IRan8813ch564._',
      database: process.env.DB_NAME || 'gabriel_dev',
    },
  },
  production: {
    ...sharedConfig,
    connection: {
      host: process.env.DB_HOST || 'gebral-db-rlwxdk',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'esan',
      password: process.env.DB_PASS || 'IRan8813ch564._',
      database: process.env.DB_NAME || 'gabriel',
    },
  },
};

// بررسی صحت مقداردهی محیط
if (!config[env]) {
  throw new Error(`Invalid NODE_ENV value: ${env}`);
}

console.log(`Running in ${env} mode`);

// خروجی نهایی بر اساس محیط
module.exports = config[env];
