import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/spidr-airfryer-form/',
  plugins: [react()],
  build: {
    minify: false, 
  },
});
