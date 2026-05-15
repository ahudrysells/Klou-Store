const express = require('express');
const cors = require('cors');
const { Client, Environment } = require('square');
const uuid = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración Square
const client = new Client({
  accessToken: 'EAAAl1lza8Xr-TNPHsEVh5uSEg4qP8RfsU683m8TFMysnor3N3egPwNxwpCADQ8E',
  environment: Environment.Sandbox,
});

const paymentsApi = client.getPaymentsApi();

// Ruta para procesar pagos
app.post('/api/process-payment', async (req, res) => {
  const { sourceId, amount, paymentMethod, items } = req.body;

  try {
    const payment = await paymentsApi.createPayment({
      sourceId: sourceId,
      amountMoney: {
        amount: Math.round(amount * 100), // Convertir a centavos
        currency: 'USD',
      },
      customerId: 'LVHKC01GJGVVD7299',
      locationId: 'LVHKC01GJGVVD7299',
      referenceId: uuid.v4(),
      note: `${paymentMethod.toUpperCase()} - ${items.length} items`,
      receiptNumber: uuid.v4().substring(0, 8),
    });

    if (payment.result) {
      res.json({
        success: true,
        paymentId: payment.result.payment.id,
        receipt: payment.result.payment.receiptNumber,
      });
    } else {
      res.status(400).json({ success: false, error: 'Payment failed' });
    }
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para obtener el token Web Payments SDK
app.get('/api/config', (req, res) => {
  res.json({
    appId: 'sandbox-sq0idb-WHHZzCfLTyQHj2Onf1DvdQ',
    locationId: 'LVHKC01GJGVVD7299',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Flea Market POS Server running on port ${PORT}`);
});
