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
          if (req.url !== '/api/questions') return next()

          const dbPath = resolve(__dirname, 'mock/db.json')
          let db: Record<string, { question: string; answers: string[]; next_ids: string[] }>
          try {
            db = JSON.parse(readFileSync(dbPath, 'utf-8'))
          } catch {
            return next()
          }

          let body = ''
          req.on('data', (chunk) => { body += chunk })
          req.on('end', () => {
            let parsed: { meta?: { question_id: string }; selected?: number } = {}
            try { parsed = JSON.parse(body) } catch { /* first call */ }

            let questionId = 'root'
            if (parsed.meta?.question_id && typeof parsed.selected === 'number') {
              const current = db[parsed.meta.question_id]
              questionId = current?.next_ids?.[parsed.selected] ?? 'root'
            }

            const node = db[questionId]
            if (!node) {
              res.statusCode = 404
              res.end(JSON.stringify({ error: 'Pergunta não encontrada' }))
              return
            }

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              question: node.question,
              answers: node.answers,
              meta: { question_id: questionId }
            }))
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
