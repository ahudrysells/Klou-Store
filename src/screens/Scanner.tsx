import React, { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { useCartStore, useProductStore } from '../store'
import { CartItem, Screen } from '../types'

export default function Scanner({ onNav }: { onNav: (s: Screen) => void }) {
  const [code, setCode] = useState('')
  const [last, setLast] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)
  const cart = useCartStore()
  const products = useProductStore()
  
  const handleScan = () => {
    if (!code) return
    setNotFound(false)
    
    // Buscar en los 534 productos
    const product = products.findByBarcode(code)
    
    if (product) {
      const item: CartItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      }
      cart.add(item)
      setLast(product)
      setCode('')
      alert(`✅ ${product.name} - $${product.price} (Stock: ${product.stock})`)
    } else {
      setNotFound(true)
      alert(`❌ Producto no encontrado: ${code}`)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header count={0} onCart={() => onNav('cart')} />
      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        <h2 className="text-2xl font-bold">Escáner de Códigos</h2>
        
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-5xl mb-4">📱</p>
          <p className="text-gray-600 font-medium">Cámara aquí (cuando esté disponible)</p>
          <p className="text-gray-500 text-sm mt-2">Usa el ingreso manual abajo</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">Ingresa código de barras (0001-0534)</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Escanea o escribe el código..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
              autoFocus
              maxLength={4}
              className={`flex-1 px-4 py-2 border-2 rounded-lg text-xl font-bold focus:outline-none ${notFound ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
            />
            <Button onClick={handleScan}>Escanear</Button>
          </div>
        </div>
        
        {last && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-green-900">✅ Último Escaneado</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Nombre:</span>
                <span className="font-semibold">{last.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Código:</span>
                <span className="font-mono">{last.barcode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Marca:</span>
                <span className="font-semibold">{last.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Precio:</span>
                <span className="text-blue-600 font-bold text-lg">${last.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Stock:</span>
                <span className={`font-semibold ${last.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{last.stock} unidades</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
          <h3 className="font-semibold text-blue-900 mb-3">📖 Instrucciones:</h3>
          <ul className="text-sm text-blue-900 space-y-2 list-decimal list-inside">
            <li>Escribe el código (0001 a 0534)</li>
            <li>Presiona Enter o haz clic en "Escanear"</li>
            <li>El producto se agregará al carrito</li>
            <li>Base de datos: 534 productos del manifiesto</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
