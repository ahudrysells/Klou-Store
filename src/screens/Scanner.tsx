import React, { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { useCartStore, useProductStore } from '../store'
import { CartItem, Screen } from '../types'

export default function Scanner({ onNav }: { onNav: (s: Screen) => void }) {
  const [code, setCode] = useState('')
  const [last, setLast] = useState<any>(null)
  const cart = useCartStore()
  const products = useProductStore()
  
  const handleScan = () => {
    if (!code) return
    const p = products.products.find(x => x.barcode === code)
    if (p) {
      const item: CartItem = { id: p.id, productId: p.id, name: p.name, price: p.price, quantity: 1 }
      cart.add(item)
      setLast(p)
      setCode('')
      alert(`✅ ${p.name} added`)
    } else {
      if (confirm(`Create product with code ${code}?`)) {
        products.add({ id: Date.now().toString(), name: `Product ${code}`, sku: code, barcode: code, price: 10, stock: 0, createdAt: new Date().toISOString() })
        alert('✅ Created. Scan again')
      }
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header count={0} onCart={() => onNav('cart')} />
      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        <h2 className="text-2xl font-bold">Scanner</h2>
        
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-5xl mb-4">📱</p>
          <p className="text-gray-600 font-medium">Camera scanner here</p>
          <p className="text-gray-500 text-sm mt-2">(Manual input below)</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">Manual Code Entry</h3>
          <div className="flex gap-3">
            <input type="text" placeholder="Scan or type code..." value={code} onChange={e => setCode(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleScan()} autoFocus className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" />
            <Button onClick={handleScan}>Scan</Button>
          </div>
        </div>
        
        {last && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Last Scanned</h3>
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{last.name}</p>
                <p className="text-sm text-gray-500">Code: {last.barcode}</p>
                <p className="text-sm text-gray-500">Stock: {last.stock}</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">${last.price}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
