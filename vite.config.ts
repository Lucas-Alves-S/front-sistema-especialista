import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method !== 'POST') return next()

          const dbPath = resolve(__dirname, 'mock/db.json')
          let db: Record<string, unknown>
          try {
            db = JSON.parse(readFileSync(dbPath, 'utf-8'))
          } catch {
            return next()
          }

          const url = req.url ?? ''
          if (!(url in db)) return next()

          // Consume body before responding (avoids broken pipe)
          let body = ''
          req.on('data', (chunk) => { body += chunk })
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(db[url]))
          })
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
