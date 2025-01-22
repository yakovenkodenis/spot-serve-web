import path from 'node:path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(() => ({
  base: '/spot-serve-web',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
 
  plugins: [react()],
}));
