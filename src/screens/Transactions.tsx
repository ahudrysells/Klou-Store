import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { useTransactionStore } from '../store'
import { Screen, Transaction } from '../types'

export default function Transactions({ onNav }: { onNav: (s: Screen) => void }) {
  const trans = useTransactionStore()
  const [groupedByDay, setGroupedByDay] = useState<{[key: string]: Transaction[]}>({})
  
  // Cargar del localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem('klou-transactions')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        data.forEach((t: Transaction) => trans.add(t))
      } catch (err) {
        console.error('Error loading transactions:', err)
      }
    }
  }, [])
  
  // Agrupar por día
  useEffect(() => {
    const grouped: {[key: string]: Transaction[]} = {}
    trans.transactions.forEach(t => {
      if (!grouped[t.date]) grouped[t.date] = []
      grouped[t.date].push(t)
    })
    setGroupedByDay(grouped)
    // Guardar en localStorage
    localStorage.setItem('klou-transactions', JSON.stringify(trans.transactions))
  }, [trans.transactions])
  
  const exportToExcel = () => {
    const rows: string[] = [
      'Fecha,Hora,Método,Total,Items,Cambio'
    ]
    
    Object.entries(groupedByDay).forEach(([date, transactions]) => {
      transactions.forEach(t => {
        const items = t.items.map(i => `${i.name}(x${i.quantity})`).join('|')
        const change = t.change ? t.change.toFixed(2) : 'N/A'
        rows.push(`"${date}","${t.time}","${t.method}","${t.total.toFixed(2)}","${items}","${change}"`)
      })
    })
    
    const csv = rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Klou-Sales-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    alert('✅ Archivo descargado')
  }
  
  const icons = { cash: '💵', card: '💳', whatnot: '📺', gift: '🎁' }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header count={0} onCart={() => onNav('home')} />
      <main className="max-w-2xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Ventas</h2>
          <Button onClick={exportToExcel} size="sm">📊 Exportar Excel</Button>
        </div>
        
        {trans.transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-5xl mb-4">📊</p>
            <p className="text-gray-500">Sin ventas aún</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDay).sort().reverse().map(([date, transactions]) => {
              const dayTotal = transactions.reduce((s, t) => s + t.total, 0)
              return (
                <div key={date}>
                  <h3 className="font-bold text-lg mb-3 text-gray-800">
                    {date} - ${dayTotal.toFixed(2)} ({transactions.length} ventas)
                  </h3>
                  <div className="space-y-3">
                    {transactions.map(t => (
                      <div key={t.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{icons[t.method]}</span>
                            <div>
                              <p className="font-bold uppercase text-sm">{t.method}</p>
                              <p className="text-xs text-gray-500">{t.time}</p>
                            </div>
                          </div>
                          <p className="text-xl font-bold text-blue-600">${t.total.toFixed(2)}</p>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <p className="text-xs text-gray-600 mb-2">{t.items.length} items</p>
                          {t.items.map((i, idx) => <p key={idx} className="text-xs text-gray-500">• {i.name} x{i.quantity}</p>)}
                        </div>
                        {t.method === 'cash' && t.change !== undefined && (
                          <div className="border-t border-gray-200 mt-3 pt-3 text-xs text-gray-600">
                            Efectivo: ${t.cash?.toFixed(2)} | Cambio: ${t.change.toFixed(2)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
