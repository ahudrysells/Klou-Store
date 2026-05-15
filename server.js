const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '.')));

// Ruta raíz - servir el HTML
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'klou-store-app.html');
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.send('<h1>Klou Store - Servidor Activo ✓</h1><p>Cargando app...</p>');
  }
});

// Ruta para obtener configuración Square
app.get('/api/config', (req, res) => {
  res.json({
    appId: 'sandbox-sq0idb-WHHZzCfLTyQHj2Onf1DvdQ',
    locationId: 'LVHKC01GJGVVD7299',
  });
});

// Ruta para procesar pagos (simulada por ahora)
app.post('/api/process-payment', async (req, res) => {
  const { amount, paymentMethod, items } = req.body;

  try {
    res.json({
      success: true,
      paymentId: 'payment_' + Date.now(),
      amount: amount,
      method: paymentMethod,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Klou Store POS Server running on port ${PORT}`);
  console.log(`✓ App available at http://localhost:${PORT}`);
});
