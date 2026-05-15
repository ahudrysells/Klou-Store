import React, { useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useCartStore, useProductStore } from '../store';
import { CartItem, Screen } from '../types';

interface ScannerScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ScannerScreen: React.FC<ScannerScreenProps> = ({ onNavigate }) => {
  const [scannedCode, setScannedCode] = useState('');
  const [lastProduct, setLastProduct] = useState<any>(null);

  const addToCart = useCartStore((state) => state.addItem);
  const products = useProductStore((state) => state.products);
  const addProduct = useProductStore((state) => state.addProduct);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleScan = () => {
    if (!scannedCode.trim()) return;

    const product = products.find((p) => p.barcode === scannedCode);

    if (product) {
      const cartItem: CartItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price,
      };
      addToCart(cartItem);
      setLastProduct(product);
      setScannedCode('');
      alert(`✅ ${product.name} agregado al carrito`);
    } else {
      const createNew = confirm(
        `Producto no encontrado. ¿Crear nuevo producto con código ${scannedCode}?`
      );
      if (createNew) {
        const newProduct = {
          id: Date.now().toString(),
          name: `Producto ${scannedCode}`,
          sku: scannedCode,
          barcode: scannedCode,
          price: 10.0,
          stock: 0,
          createdAt: new Date().toISOString(),
        };
        addProduct(newProduct);
        alert('✅ Producto creado. Escanea de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header cartCount={cartCount} onCartClick={() => onNavigate('cart')} />

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <h2 className="text-3xl font-bold">Escáner</h2>

        {/* Scanner Placeholder */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">📱</p>
          <p className="text-gray-600 font-medium">Aquí irá el scanner de cámara</p>
          <p className="text-gray-500 text-sm mt-2">(Requiere expo-camera con permisos)</p>
        </div>

        {/* Manual Input */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-lg">Ingreso Manual de Código</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Escanea o escribe el código..."
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
              autoFocus
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <Button onClick={handleScan} variant="primary">
              Escanear
            </Button>
          </div>
        </div>

        {/* Last Scanned */}
        {lastProduct && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Último Producto Escaneado</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{lastProduct.name}</p>
                <p className="text-sm text-gray-500">Código: {lastProduct.barcode}</p>
                <p className="text-sm text-gray-500">Stock: {lastProduct.stock}</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">${lastProduct.price.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
          <h3 className="font-semibold text-blue-900 mb-3">Cómo usar:</h3>
          <ol className="text-sm text-blue-900 space-y-2 list-decimal list-inside">
            <li>Escanea el código de barras con la cámara</li>
            <li>O escribe el código manualmente</li>
            <li>El producto se agregará al carrito</li>
            <li>Si no existe, puedes crear uno nuevo</li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default ScannerScreen;
