import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Code splitting otomatis: setiap `React.lazy` menghasilkan chunk tersendiri.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    sourcemap: false,
  },
})
