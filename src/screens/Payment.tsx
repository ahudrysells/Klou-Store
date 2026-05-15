import React, { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { useCartStore, useTransactionStore } from '../store'
import { PaymentMethod, Screen } from '../types'

const TAX = 0.075

export default function Payment({ onNav }: { onNav: (s: Screen) => void }) {
  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [cash, setCash] = useState('')
  const cart = useCartStore()
  const trans = useTransactionStore()
  const count = cart.items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = cart.total()
  const tax = subtotal * TAX
  const total = subtotal + tax
  const change = cash ? parseFloat(cash) - total : 0
  
  const handlePay = () => {
    if (!method) { alert('Select payment method'); return }
    if (method === 'cash' && parseFloat(cash) < total) { alert('Insufficient cash'); return }
    
    trans.add({
      id: Date.now().toString(),
      items: cart.items,
      subtotal,
      tax,
      total,
      method,
      cash: method === 'cash' ? parseFloat(cash) : undefined,
      change: method === 'cash' ? change : undefined,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    })
    
    cart.clear()
    alert(`✅ Payment completed\nMethod: ${method.toUpperCase()}\nTotal: $${total.toFixed(2)}`)
    onNav('home')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header count={count} onCart={() => onNav('cart')} />
      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        <h2 className="text-2xl font-bold">Payment</h2>
        
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Tax (7.5%):</span><span className="font-semibold">${tax.toFixed(2)}</span></div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-xl"><span className="font-bold">Total:</span><span className="font-bold text-blue-600">${total.toFixed(2)}</span></div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {[{ m: 'cash' as PaymentMethod, e: '💵', l: 'CASH' }, { m: 'card' as PaymentMethod, e: '💳', l: 'CARD' }, { m: 'whatnot' as PaymentMethod, e: '📺', l: 'WHATNOT' }, { m: 'gift' as PaymentMethod, e: '🎁', l: 'GIFT' }].map(({ m, e, l }) => (
              <button key={m} onClick={() => setMethod(m)} className={`p-6 rounded-lg border-2 transition ${method === m ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                <div className="text-3xl mb-2">{e}</div>
                <div className="font-bold text-sm">{l}</div>
              </button>
            ))}
          </div>
        </div>
        
        {method === 'cash' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cash Received</label>
              <input type="number" placeholder="0.00" value={cash} onChange={e => setCash(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-2xl font-bold focus:outline-none focus:border-blue-500" />
            </div>
            {cash && <div className="text-lg"><span className="text-gray-600">Change: </span><span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>${change.toFixed(2)}</span></div>}
          </div>
        )}
        
        <div className="space-y-2">
          <Button onClick={handlePay} disabled={!method} className="w-full">Confirm Payment</Button>
          <Button onClick={() => onNav('cart')} variant="secondary" className="w-full">Cancel</Button>
        </div>
      </main>
    </div>
  )
}
