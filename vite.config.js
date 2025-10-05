
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: { jsx: 'automatic', jsxImportSource: 'react' },

  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['pawcial.guven.uk','192.168.0.72','localhost'],
    origin: 'http://pawcial.guven.uk:5173',
    hmr: { host: 'pawcial.guven.uk', protocol: 'ws', clientPort: 5173 },
    cors: true
  },

  // ⬇ preview ayrı ayarlanır
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['pawcial.guven.uk','192.168.0.72','localhost'],
    cors: true
  }
})
