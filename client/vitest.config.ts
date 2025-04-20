import { defineConfig } from 'vitest/config'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     test: {
       globals: true, // Включаем глобальные функции describe, it, expect
       environment: 'jsdom', // Указываем окружение для тестов React
       setupFiles: './src/test/setup.ts', // Файл для настройки тестов
     },
   })