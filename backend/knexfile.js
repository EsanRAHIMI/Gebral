require('dotenv').config(); // بارگذاری متغیرهای محیطی از فایل .env

const sharedConfig = {
  client: 'pg', // مشخص کردن کلاینت پایگاه داده (PostgreSQL)
  migrations: {
    directory: './db/migrations', // مسیر فایل‌های مهاجرت
    tableName: 'knex_migrations' // نام جدول مهاجرت‌ها در پایگاه داده
  }
};

module.exports = {
  development: {
    ...sharedConfig,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }
  },
  production: {
    ...sharedConfig,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }
  }
};
