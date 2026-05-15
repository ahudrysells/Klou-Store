import React, { useState, useEffect } from 'react'
import Home from './screens/Home'
import Cart from './screens/Cart'
import Payment from './screens/Payment'
import Scanner from './screens/Scanner'
import Inventory from './screens/Inventory'
import Transactions from './screens/Transactions'
import Nav from './components/Nav'
import { useProductStore } from './store'
import { Screen } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [loading, setLoading] = useState(true)
  const loadProducts = useProductStore(s => s.loadProducts)
  
  useEffect(() => {
    loadProducts().finally(() => setLoading(false))
  }, [loadProducts])
  
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-4xl mb-4">⏳</p>
        <p className="text-gray-600">Loading Klou Store...</p>
      </div>
    </div>
  )
  
  const render = () => {
    switch (screen) {
      case 'home': return <Home onNav={setScreen} />
      case 'cart': return <Cart onNav={setScreen} />
      case 'payment': return <Payment onNav={setScreen} />
      case 'scanner': return <Scanner onNav={setScreen} />
      case 'inventory': return <Inventory onNav={setScreen} />
      case 'transactions': return <Transactions onNav={setScreen} />
      default: return <Home onNav={setScreen} />
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {render()}
      <Nav current={screen} onNav={setScreen} />
    </div>
  )
}
