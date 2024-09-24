import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/MsunSiteFront/',
  plugins: [
    vue(),
    copy({
      // 显示日志
      verbose: true,
      targets: [
        { src: 'dist/index.html', dest: 'dist' }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
