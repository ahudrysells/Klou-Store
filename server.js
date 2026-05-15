const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Klou Store</title>
    <script src="https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.4/html5-qrcode.min.js"><\/script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background: #0f0f0f; color: #fff; }
        .header { background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%); padding: 20px; text-align: center; font-size: 28px; font-weight: bold; color: #4faafe; border-bottom: 2px solid #4faafe; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .scanner { margin: 20px 0; text-align: center; }
        #qr-reader { width: 100%; max-width: 500px; margin: 0 auto; border: 2px solid #4faafe; border-radius: 12px; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 2px solid #4faafe; background: #1a1a2e; color: #4faafe; border-radius: 8px; font-size: 16px; }
        button { width: 100%; padding: 14px; background: #4faafe; color: #000; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin: 10px 0; }
        .cart { background: #1a1a2e; padding: 20px; margin: 20px 0; border: 2px solid #4faafe; border-radius: 12px; }
        .item { background: #0f3460; padding: 10px; margin: 5px 0; border-left: 3px solid #4faafe; }
        .total { font-size: 20px; font-weight: bold; color: #4faafe; margin-top: 10px; }
        .payment-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
        .payment-opts button { margin: 0; }
        .payment-opts button.selected { background: #2ecc71; }
    <\/style>
</head>
<body>
    <div class="header">🚀 KLOU STORE - POS<\/div>
    
    <div class="container">
        <div class="scanner">
            <h3 style="color: #4faafe; margin-bottom: 10px;">📱 Escanea o escribe código<\/h3>
            <div id="qr-reader" style="height: 300px;"><\/div>
            <input type="text" id="manual-scan" placeholder="Código del item...">
        <\/div>

        <div class="cart">
            <h3 style="color: #4faafe;">🛒 Carrito<\/h3>
            <div id="cart-items"><\/div>
            <div class="total">Total: $<span id="total">0.00<\/span><\/div>
        <\/div>

        <div class="payment-opts" id="payment-opts" style="display: none;">
            <button onclick="selectPayment('cash')">💵 Cash<\/button>
            <button onclick="selectPayment('card')">💳 Tarjeta<\/button>
            <button onclick="selectPayment('whatnot')">📺 Whatnot<\/button>
            <button onclick="selectPayment('gift')">🎁 Gift<\/button>
        <\/div>

        <button onclick="checkout()" id="checkout-btn" disabled>Confirmar Pago<\/button>
        <button onclick="exportCSV()" style="background: #51cf66;">📥 Exportar CSV<\/button>
        <button onclick="clearCart()" style="background: #ff4757;">🗑️ Limpiar<\/button>
    <\/div>

    <script>
        const items = [
            {id: "0001", desc: "DKNY Seamless Bra", price: 10},
            {id: "0002", desc: "Room Service Short", price: 10},
            {id: "0003", desc: "DKNY Swimsuit", price: 10},
            {id: "0004", desc: "GV Amanda Capri", price: 10},
            {id: "0005", desc: "LE Quilted Set", price: 10},
        ];

        let cart = [];
        let selectedPayment = null;

        window.addEventListener('load', () => {
            loadCart();
            initScanner();
        });

        function initScanner() {
            const qrScanner = new Html5Qrcode("qr-reader");
            Html5Qrcode.getCameras().then(devices => {
                if (devices.length > 0) {
                    qrScanner.start(devices[0].id, {fps: 10, qrbox: 250, facingMode: "environment"}, onScan, null).catch(err => {});
                }
            }).catch(err => {});

            document.getElementById('manual-scan').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    onScan(e.target.value);
                    e.target.value = '';
                }
            });
        }

        function onScan(code) {
            const item = items.find(i => i.id === code);
            if (item) {
                const existing = cart.find(c => c.id === item.id);
                if (existing) existing.qty++;
                else cart.push({...item, qty: 1});
                updateCart();
            }
        }

        function updateCart() {
            const html = cart.map((item, idx) => \`<div class="item">\${item.desc} x\${item.qty} = \$\${(item.price * item.qty).toFixed(2)} <button onclick="removeItem(\${idx})" style="width: 50px; padding: 5px;">✕<\/button><\/div>\`).join('');
            document.getElementById('cart-items').innerHTML = html;
            
            const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
            document.getElementById('total').textContent = total.toFixed(2);
            
            if (cart.length > 0) {
                document.getElementById('payment-opts').style.display = 'grid';
                document.getElementById('checkout-btn').disabled = false;
            } else {
                document.getElementById('payment-opts').style.display = 'none';
                document.getElementById('checkout-btn').disabled = true;
            }

            localStorage.setItem('cart', JSON.stringify(cart));
        }

        function removeItem(idx) {
            cart.splice(idx, 1);
            updateCart();
        }

        function selectPayment(method) {
            selectedPayment = method;
            document.querySelectorAll('.payment-opts button').forEach(b => b.classList.remove('selected'));
            event.target.classList.add('selected');
        }

        function checkout() {
            if (cart.length === 0 || !selectedPayment) return alert('Selecciona método de pago');
            
            const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
            let trans = JSON.parse(localStorage.getItem('trans') || '[]');
            trans.push({date: new Date().toLocaleString(), method: selectedPayment, amount: total, items: cart.length});
            localStorage.setItem('trans', JSON.stringify(trans));
            
            alert('✅ Pago registrado: \$' + total.toFixed(2));
            cart = [];
            selectedPayment = null;
            updateCart();
        }

        function exportCSV() {
            const trans = JSON.parse(localStorage.getItem('trans') || '[]');
            if (trans.length === 0) return alert('Sin transacciones');
            let csv = 'Fecha,Metodo,Monto,Items\\n';
            trans.forEach(t => csv += \`"\${t.date}",\${t.method},\$\${t.amount.toFixed(2)},\${t.items}\\n\`);
            const blob = new Blob([csv], {type: 'text/csv'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'klou-store.csv';
            a.click();
        }

        function clearCart() {
            if (confirm('¿Limpiar todo?')) {
                cart = [];
                localStorage.clear();
                updateCart();
            }
        }

        function loadCart() {
            cart = JSON.parse(localStorage.getItem('cart') || '[]');
            updateCart();
        }
    <\/script>
</body>
</html>
  `);
});

app.get('/health', (req, res) => res.json({ok: true}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Klou Store running on ' + PORT));
