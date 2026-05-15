import React, { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import SquarePaymentForm from '../components/SquarePaymentForm'
import { useCartStore, useTransactionStore } from '../store'
import { PaymentMethod, Screen } from '../types'

const TAX = 0.075

export default function Payment({ onNav }: { onNav: (s: Screen) => void }) {
  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [cash, setCash] = useState('')
  const [processing, setProcessing] = useState(false)
  
  const cart = useCartStore()
  const trans = useTransactionStore()
  const count = cart.items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = cart.total()
  const tax = subtotal * TAX
  const total = subtotal + tax
  const change = cash ? parseFloat(cash) - total : 0
  
  const completeTransaction = () => {
    trans.add({
      id: Date.now().toString(),
      items: cart.items,
      subtotal,
      tax,
      total,
      method: method!,
      cash: method === 'cash' ? parseFloat(cash) : undefined,
      change: method === 'cash' ? change : undefined,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    })
    
    cart.clear()
    alert(`✅ Pago Completado\nMétodo: ${method?.toUpperCase()}\nTotal: $${total.toFixed(2)}`)
    onNav('home')
  }
  
  const handleCashPayment = async () => {
    if (parseFloat(cash) < total) { alert('Efectivo insuficiente'); return }
    setProcessing(true)
    await new Promise(r => setTimeout(r, 1000))
    completeTransaction()
    setProcessing(false)
  }
  
  const handleSquareSuccess = () => {
    completeTransaction()
  }
  
  const handleSquareError = (error: string) => {
    alert('❌ ' + error)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header count={count} onCart={() => onNav('cart')} />
      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        <h2 className="text-2xl font-bold">Pago</h2>
        
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Impuesto (7.5%):</span><span className="font-semibold">${tax.toFixed(2)}</span></div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-xl"><span className="font-bold">Total:</span><span className="font-bold text-blue-600">${total.toFixed(2)}</span></div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Método de Pago</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { m: 'cash' as PaymentMethod, e: '💵', l: 'CASH' },
              { m: 'card' as PaymentMethod, e: '💳', l: 'CARD' },
              { m: 'whatnot' as PaymentMethod, e: '📺', l: 'WHATNOT' },
              { m: 'gift' as PaymentMethod, e: '🎁', l: 'GIFT' }
            ].map(({ m, e, l }) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`p-6 rounded-lg border-2 transition ${
                  method === m ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-3xl mb-2">{e}</div>
                <div className="font-bold text-sm">{l}</div>
              </button>
            ))}
          </div>
        </div>
        
        {method === 'cash' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700">Efectivo Recibido</label>
            <input
              type="number"
              placeholder="0.00"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-2xl font-bold focus:outline-none focus:border-blue-500"
            />
            {cash && (
              <div className="text-lg">
                <span className="text-gray-600">Cambio: </span>
                <span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>${change.toFixed(2)}</span>
              </div>
            )}
            <Button onClick={handleCashPayment} disabled={processing} className="w-full">
              {processing ? 'Procesando...' : 'Confirmar Pago'}
            </Button>
          </div>
        )}
        
        {method === 'card' && (
          <SquarePaymentForm
            amount={total}
            onSuccess={handleSquareSuccess}
            onError={handleSquareError}
            onProcessing={setProcessing}
          />
        )}
        
        {method === 'whatnot' && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
            <h3 className="font-bold mb-2 text-blue-900">📺 Whatnot/Livestream</h3>
            <p className="text-blue-900 text-sm mb-4">Se registrará como venta Whatnot</p>
            <Button onClick={completeTransaction} className="w-full">Confirmar Venta</Button>
          </div>
        )}
        
        {method === 'gift' && (
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded">
            <h3 className="font-bold mb-2 text-purple-900">🎁 Regalo/Promoción</h3>
            <p className="text-purple-900 text-sm mb-4">Se registrará como regalo (sin pago)</p>
            <Button onClick={completeTransaction} className="w-full">Confirmar Regalo</Button>
          </div>
        )}
        
        <Button onClick={() => onNav('cart')} variant="secondary" className="w-full">Cancelar</Button>
      </main>
    </div>
  )
}
