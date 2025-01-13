import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// بارگذاری متغیرهای محیطی
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // بارگذاری .env

  if (!env.VITE_BACKEND_URL) {
    throw new Error('VITE_BACKEND_URL is not defined in the environment variables.');
  }

  console.log('VITE_BACKEND_URL:', env.VITE_BACKEND_URL);

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': env.VITE_BACKEND_URL,
      },
    },
  };
});
