import React from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { useCartStore } from '../store'
import { Screen } from '../types'

const TAX = 0.075

export default function Cart({ onNav }: { onNav: (s: Screen) => void }) {
  const cart = useCartStore()
  const count = cart.items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = cart.total()
  const tax = subtotal * TAX
  const total = subtotal + tax
  
  if (cart.items.length === 0) return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header count={0} onCart={() => {}} />
      <div className="flex flex-col items-center justify-center h-80">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-gray-500 text-lg">Cart is empty</p>
      </div>
    </div>
  )
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header count={count} onCart={() => {}} />
      <main className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        <h2 className="text-2xl font-bold">Cart</h2>
        
        {cart.items.map(item => (
          <div key={item.productId} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => cart.update(item.productId, item.quantity - 1)} className="px-2 py-1 bg-gray-100 rounded">−</button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button onClick={() => cart.update(item.productId, item.quantity + 1)} className="px-2 py-1 bg-gray-100 rounded">+</button>
            </div>
            <div className="text-right min-w-20">
              <p className="font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => cart.remove(item.productId)} className="text-xs text-red-500 mt-1">Remove</button>
            </div>
          </div>
        ))}
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (7.5%):</span>
            <span className="font-semibold">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between text-lg">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
          <Button onClick={() => onNav('payment')} className="w-full mt-4">Proceed to Payment</Button>
          <Button onClick={() => onNav('home')} variant="secondary" className="w-full">Continue Shopping</Button>
        </div>
      </main>
    </div>
  )
}
