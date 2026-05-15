import { useState, useEffect, useRef } from 'react'
import { CheckCircle, DollarSign, CreditCard, Gift, Tv, Loader2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { PaymentMethod, Transaction } from '../types'

declare const Square: any

const METHODS: { id: PaymentMethod; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'cash', label: 'Efectivo', icon: <DollarSign size={22} />, color: 'bg-green-500' },
  { id: 'card', label: 'Tarjeta', icon: <CreditCard size={22} />, color: 'bg-blue-600' },
  { id: 'whatnot', label: 'Whatnot', icon: <Tv size={22} />, color: 'bg-purple-500' },
  { id: 'gift', label: 'Gift Card', icon: <Gift size={22} />, color: 'bg-orange-500' },
]

export default function PaymentScreen() {
  const { cart, cartTotal, clearCart, addTransaction, setScreen } = useStore()
  const [method, setMethod] = useState<PaymentMethod>('cash')
  const [cashReceived, setCashReceived] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [squareReady, setSquareReady] = useState(false)
  const cardContainerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<any>(null)
  const paymentsRef = useRef<any>(null)

  const total = cartTotal()
  const change = cashReceived ? Math.max(0, parseFloat(cashReceived) - total) : 0

  useEffect(() => {
    if (method === 'card') {
      initSquare()
    }
    return () => {
      if (cardRef.current) {
        cardRef.current.destroy().catch(() => {})
        cardRef.current = null
        setSquareReady(false)
      }
    }
  }, [method])

  const initSquare = async () => {
    if (!window.Square) return
    try {
      const payments = Square.payments('sandbox-sq0idb-WHHZzCfLTyQHj2Onf1DvdQ', 'LVHKC01GJGVVD7299')
      paymentsRef.current = payments
      const card = await payments.card()
      if (cardContainerRef.current) {
        cardContainerRef.current.innerHTML = ''
        await card.attach(cardContainerRef.current)
        cardRef.current = card
        setSquareReady(true)
      }
    } catch (e) {
      console.error('Square init error:', e)
    }
  }

  const processPayment = async () => {
    setError('')
    setLoading(true)
    try {
      let squarePaymentId: string | undefined

      if (method === 'card' && cardRef.current) {
        const result = await cardRef.current.tokenize()
        if (result.status !== 'OK') {
          throw new Error(result.errors?.[0]?.message || 'Error al tokenizar tarjeta')
        }
        const res = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: result.token,
            amount: Math.round(total * 100),
            currency: 'USD',
            idempotencyKey: crypto.randomUUID(),
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error en el pago')
        squarePaymentId = data.paymentId
      }

      const transaction: Transaction = {
        id: `txn-${Date.now()}`,
        items: [...cart],
        total,
        paymentMethod: method,
        timestamp: new Date(),
        squarePaymentId,
      }
      addTransaction(transaction)
      clearCart()
      setSuccess(true)
    } catch (e: any) {
      setError(e.message || 'Error procesando el pago')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-8 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">¡Pago completado!</h2>
        <p className="text-gray-500 mb-2">Total: <span className="font-bold text-gray-800">${total.toFixed(2)}</span></p>
        <p className="text-gray-400 text-sm mb-8 capitalize">Método: {METHODS.find(m => m.id === method)?.label}</p>
        {change > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-3 mb-6">
            <p className="text-green-700 font-semibold">Cambio: ${change.toFixed(2)}</p>
          </div>
        )}
        <button onClick={() => { setSuccess(false); setScreen('home') }}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors">
          Nueva venta
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-4 pt-10 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Pago</h1>
        <p className="text-3xl font-bold text-blue-600 mt-1">${total.toFixed(2)}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4">
        {/* Payment methods */}
        <div className="grid grid-cols-2 gap-3">
          {METHODS.map((m) => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                method === m.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
              <div className={`${m.color} text-white rounded-xl p-2`}>{m.icon}</div>
              <span className={`font-medium text-sm ${method === m.id ? 'text-blue-600' : 'text-gray-700'}`}>
                {m.label}
              </span>
            </button>
          ))}
        </div>

        {/* Cash change */}
        {method === 'cash' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <label className="text-sm font-medium text-gray-600 mb-2 block">Efectivo recibido</label>
            <input type="number" placeholder="$0.00" value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold outline-none focus:border-blue-400" />
            {cashReceived && (
              <div className="mt-3 p-3 bg-green-50 rounded-xl flex justify-between items-center">
                <span className="text-green-700 text-sm font-medium">Cambio</span>
                <span className="text-green-700 font-bold">${change.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {/* Square card form */}
        {method === 'card' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-sm font-medium text-gray-600 mb-3">Datos de tarjeta</p>
            <div ref={cardContainerRef} className="min-h-[100px]" />
            {!squareReady && (
              <p className="text-xs text-gray-400 mt-2 text-center">Cargando formulario de Square…</p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Resumen ({cart.length} items)</p>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span className="text-gray-700">{item.name} x{item.quantity}</span>
              <span className="text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border-t border-gray-100 p-4 pb-20">
        <button onClick={processPayment} disabled={loading}
          className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Procesando…</> : `Cobrar $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  )
}
