import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const distPath = join(__dirname, 'dist');

// Verificar que dist existe
if (!fs.existsSync(distPath)) {
  console.error('❌ ERROR: dist folder not found!');
  process.exit(1);
}

// Servir archivos estáticos con cache headers
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: false
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Todas las rutas van a index.html (SPA)
app.get('*', (req, res) => {
  const indexPath = join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Klou Store running on http://localhost:${PORT}`);
  console.log(`✅ Serving files from: ${distPath}`);
});
