import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
    server: {
        // allow popups to reach back
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
            // you probably don’t need COEP unless you’re doing SharedArrayBuffer
            'Cross-Origin-Embedder-Policy': 'unsafe-none',
        },
    },
})
