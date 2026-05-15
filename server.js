import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
const PORT = process.env.PORT || 3000
const distPath = join(__dirname, 'dist')

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Static files with proper caching
app.use(express.static(distPath, {
  maxAge: '24h',
  etag: false,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0')
    }
  }
}))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

// API health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'klou-store' })
})

// SPA fallback
app.get('*', (req, res) => {
  const indexPath = join(distPath, 'index.html')
  try {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath)
    } else {
      res.status(503).json({ error: 'App not built', message: 'Please run npm run build' })
    }
  } catch (error) {
    console.error('Error serving index.html:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

const server = app.listen(PORT, () => {
  console.log(`✅ Klou Store running on port ${PORT}`)
  console.log(`📁 Serving files from: ${distPath}`)
  console.log(`🌐 URL: http://localhost:${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})
