import { Receipt, DollarSign, CreditCard, Gift, Tv, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { PaymentMethod } from '../types'

const METHOD_ICONS: Record<PaymentMethod, React.ReactNode> = {
  cash: <DollarSign size={14} />,
  card: <CreditCard size={14} />,
  gift: <Gift size={14} />,
  whatnot: <Tv size={14} />,
}
const METHOD_COLORS: Record<PaymentMethod, string> = {
  cash: 'bg-green-100 text-green-700',
  card: 'bg-blue-100 text-blue-700',
  gift: 'bg-orange-100 text-orange-700',
  whatnot: 'bg-purple-100 text-purple-700',
}
const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Efectivo', card: 'Tarjeta', gift: 'Gift Card', whatnot: 'Whatnot'
}

export default function TransactionsScreen() {
  const { transactions } = useStore()
  const [expanded, setExpanded] = useState<string | null>(null)

  const todayTotal = transactions
    .filter((t) => {
      const d = new Date(t.timestamp)
      const now = new Date()
      return d.toDateString() === now.toDateString()
    })
    .reduce((s, t) => s + t.total, 0)

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-400 px-8 text-center">
        <Receipt size={64} className="mb-4 opacity-30" />
        <h2 className="text-lg font-semibold text-gray-500">Sin ventas aún</h2>
        <p className="text-sm mt-1">Las transacciones aparecerán aquí</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-4 pt-10 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Ventas</h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="bg-blue-50 rounded-xl px-3 py-1.5">
            <p className="text-xs text-blue-600 font-medium">Ventas hoy</p>
            <p className="text-blue-700 font-bold">${todayTotal.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-3 py-1.5">
            <p className="text-xs text-gray-500 font-medium">Total transacciones</p>
            <p className="text-gray-700 font-bold">{transactions.length}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        {transactions.map((txn) => {
          const isExpanded = expanded === txn.id
          const date = new Date(txn.timestamp)
          return (
            <div key={txn.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button onClick={() => setExpanded(isExpanded ? null : txn.id)}
                className="w-full p-4 flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Receipt size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium ${METHOD_COLORS[txn.paymentMethod]}`}>
                      {METHOD_ICONS[txn.paymentMethod]}
                      {METHOD_LABELS[txn.paymentMethod]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">${txn.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{txn.items.length} items</p>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-1">
                  {txn.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} x{item.quantity}</span>
                      <span className="text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {txn.squarePaymentId && (
                    <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                      Square ID: {txn.squarePaymentId}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
