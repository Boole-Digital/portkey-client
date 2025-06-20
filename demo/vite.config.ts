import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Adjust as needed
      'react-background-iframe': path.resolve(__dirname, '../src'),
    },
  },
})
