import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const { PORT = 3000 } = process.env;
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: (process.env.NODE_ENV === 'development') ? {
      '/api': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
      '/auth': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
    } : {},
  },
  build: {
    manifest: true,
  },
  define: {
    'process.env': process.env
  }
});
