import React, { useState } from 'react'
import Header from '../components/Header'
import Keypad from '../components/Keypad'
import Button from '../components/Button'
import { useCartStore, useProductStore } from '../store'
import { CartItem, Screen } from '../types'

export default function Home({ onNav }: { onNav: (s: Screen) => void }) {
  const [amount, setAmount] = useState('')
  const [search, setSearch] = useState('')
  const cart = useCartStore()
  const products = useProductStore(s => s.products)
  const count = cart.items.reduce((s, i) => s + i.quantity, 0)
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const total = cart.total()
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header count={count} onCart={() => onNav('cart')} />
      <main className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Total</p>
          <h2 className="text-5xl font-bold text-blue-600">${total.toFixed(2)}</h2>
        </div>
        
        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" />
        
        {filtered.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filtered.map(p => (
                <button key={p.id} onClick={() => { const item: CartItem = { id: p.id, productId: p.id, name: p.name, price: p.price, quantity: 1 }; cart.add(item) }} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-500 text-left text-sm">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-blue-600 font-bold mt-1">${p.price}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Manual Entry</h3>
          <div className="bg-gray-50 rounded p-4 text-center mb-4 border-2 border-gray-200">
            <p className="text-4xl font-bold">${amount || '0.00'}</p>
          </div>
          <Keypad onKey={k => { if (k === '.' && amount.includes('.')) return; setAmount(amount + k) }} onDel={() => setAmount(amount.slice(0, -1))} />
          <Button onClick={() => { if (!amount) return; const p = parseFloat(amount); if (isNaN(p) || p <= 0) return; const item: CartItem = { id: Date.now().toString(), productId: Date.now().toString(), name: 'Manual Sale', price: p, quantity: 1 }; cart.add(item); setAmount('') }} className="w-full mt-4">Add to Cart</Button>
        </div>
      </main>
    </div>
  )
}
