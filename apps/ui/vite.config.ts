import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
                secure: false,
            },
            '/preview': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
                secure: false,
            },
            '/themes': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
                secure: false,
            },
            '/images': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
                secure: false,
            },
            '/sdk-bridge.js': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
                secure: false,
            },
            '/sdk-components-fallback.js': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    // Ensure we don't try to resolve the app itself as a dependency
    optimizeDeps: {
        exclude: ['vtdr-ui']
    }
})
