import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
const PORT = process.env.PORT || 3000
const distPath = join(__dirname, 'dist')

app.use(express.static(distPath, { maxAge: '1h', etag: false }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.get('*', (req, res) => {
  const indexPath = join(distPath, 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).send('App not built. Run: npm run build')
  }
})

app.listen(PORT, () => {
  console.log(`✅ Klou Store running on port ${PORT}`)
})
