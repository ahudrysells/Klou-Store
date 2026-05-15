import React from 'react'
import Header from '../components/Header'
import { useTransactionStore } from '../store'
import { Screen } from '../types'

export default function Transactions({ onNav }: { onNav: (s: Screen) => void }) {
  const trans = useTransactionStore()
  const today = trans.today()
  const todayTotal = today.reduce((s, t) => s + t.total, 0)
  const allTotal = trans.transactions.reduce((s, t) => s + t.total, 0)
  
  const icons = { cash: '💵', card: '💳', whatnot: '📺', gift: '🎁' }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header count={0} onCart={() => onNav('home')} />
      <main className="max-w-2xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold mb-6">Transactions</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600 text-sm mb-2">Today</p>
            <p className="text-3xl font-bold text-blue-600">${todayTotal.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">{today.length} sales</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600 text-sm mb-2">Total</p>
            <p className="text-3xl font-bold text-blue-600">${allTotal.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">{trans.transactions.length} sales</p>
          </div>
        </div>
        
        {trans.transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-5xl mb-4">📊</p>
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trans.transactions.slice().reverse().map(t => (
              <div key={t.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{icons[t.method]}</span>
                    <div>
                      <p className="font-bold uppercase text-sm">{t.method}</p>
                      <p className="text-xs text-gray-500">{t.time}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">${t.total.toFixed(2)}</p>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs text-gray-600 mb-2">{t.items.length} items</p>
                  {t.items.map((i, idx) => <p key={idx} className="text-xs text-gray-500">• {i.name} x{i.quantity}</p>)}
                </div>
                {t.method === 'cash' && t.change !== undefined && <div className="border-t border-gray-200 mt-3 pt-3 text-xs text-gray-600">Cash: ${t.cash?.toFixed(2)} | Change: ${t.change.toFixed(2)}</div>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
