import path from 'node:path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : '/spot-serve-web/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
 
  plugins: [react()],
}));
