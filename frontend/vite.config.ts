import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // Simule un DOM pour vos tests React
    setupFiles: './src/tests/setup.ts', // (Optionnel) Configuration supplémentaire
    coverage: {
      provider: 'v8', // Ou 'v8', selon vos préférences
      reporter: ['text', 'html'], // Types de rapports à générer
      exclude: ['tailwind.config.js', 'postcss.config.js'],
    },
  },
})
