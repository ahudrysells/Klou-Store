import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
const PORT = process.env.PORT || 3000
const distPath = join(__dirname, 'dist')

// Square config — use env vars in production
const SQUARE_TOKEN = process.env.SQUARE_ACCESS_TOKEN || 'EAAAl1lza8Xr-TNPHsEVh5uSEg4qP8RfsU683m8TFMysnor3N3egPwNxwpCADQ8E'
const SQUARE_LOCATION = process.env.SQUARE_LOCATION_ID || 'LVHKC01GJGVVD7299'
const SQUARE_ENV = process.env.SQUARE_ENVIRONMENT || 'sandbox'
const SQUARE_BASE = SQUARE_ENV === 'production'
  ? 'https://connect.squareup.com'
  : 'https://connect.squareupsandbox.com'

// Middleware
app.use(express.json())
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Static files
app.use(express.static(distPath, {
  maxAge: '24h',
  etag: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0')
    }
  }
}))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'klou-store' })
})

// Square — Process Payment
app.post('/api/payment', async (req, res) => {
  const { sourceId, amount, currency, idempotencyKey } = req.body

  if (!sourceId || !amount) {
    return res.status(400).json({ error: 'sourceId y amount son requeridos' })
  }

  try {
    const squareResponse = await fetch(`${SQUARE_BASE}/v2/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SQUARE_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2024-01-18',
        'X-Idempotency-Key': idempotencyKey || crypto.randomUUID()
      },
      body: JSON.stringify({
        source_id: sourceId,
        amount_money: {
          amount: amount,
          currency: currency || 'USD'
        },
        location_id: SQUARE_LOCATION
      })
    })

    const data = await squareResponse.json()

    if (!squareResponse.ok) {
      console.error('Square error:', data)
      return res.status(400).json({
        error: data.errors?.[0]?.detail || 'Error procesando pago con Square'
      })
    }

    console.log('✅ Pago procesado:', data.payment?.id)
    res.json({
      success: true,
      paymentId: data.payment?.id,
      amount: amount / 100,
      status: data.payment?.status,
      message: '✅ Pago completado exitosamente'
    })

  } catch (err) {
    console.error('Payment error:', err.message)
    res.status(500).json({ error: 'Error procesando pago: ' + err.message })
  }
})

// Square — List Catalog (optional sync)
app.get('/api/catalog', async (req, res) => {
  try {
    const response = await fetch(`${SQUARE_BASE}/v2/catalog/list?types=ITEM`, {
      headers: {
        'Authorization': `Bearer ${SQUARE_TOKEN}`,
        'Square-Version': '2024-01-18'
      }
    })
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
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

const server = app.listen(PORT, () => {
  console.log(`✅ Klou Store running on port ${PORT}`)
  console.log(`✅ Square [${SQUARE_ENV.toUpperCase()}] enabled`)
  console.log(`📁 Serving files from: ${distPath}`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})
