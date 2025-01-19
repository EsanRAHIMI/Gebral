import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// بارگذاری متغیرهای محیطی
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // بارگذاری .env

  if (!env.VITE_BACKEND_URL) {
    throw new Error('VITE_BACKEND_URL is not defined in the environment variables.');
  }

  console.log('VITE_BACKEND_URL:', env.VITE_BACKEND_URL);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // تعریف alias برای مسیرهای src
      },
    },
    server: {
      host: '0.0.0.0', // برای دسترسی از سایر دستگاه‌ها
      port: 5173,  // تغییر پورت در صورت نیاز
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''), // بازنویسی مسیرهای API
        },
      },
    },
    optimizeDeps: {
      include: ['jwt-decode'], // اطمینان از بهینه‌سازی ماژول jwt-decode
      esbuildOptions: {
        target: 'esnext', // هدف کامپایل برای سازگاری مدرن‌تر
      },
    },
    build: {
      outDir: 'dist', // مسیر خروجی برای build
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
    },
  };
});
