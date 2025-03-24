import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';


export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString();
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: ['axios', 'react', 'react-dom'],
    },
    plugins: [react(), tailwindcss(), compression(), visualizer({
      filename: 'bundle-report.html',
      open: env.VITE_VISUALIZER_OPEN === 'true',
      gzipSize: true,
      brotliSize: true,
    })],
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': env.VITE_API_BASE_URL,
      },
    },
  }

})
