import React from 'react'
import { Screen } from '../types'

export default function Nav({ current, onNav }: { current: Screen; onNav: (s: Screen) => void }) {
  const items: { s: Screen; l: string; i: string }[] = [
    { s: 'home', l: 'Checkout', i: '💳' },
    { s: 'inventory', l: 'Inventory', i: '📦' },
    { s: 'transactions', l: 'Sales', i: '📊' },
    { s: 'scanner', l: 'Scan', i: '📱' }
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex h-20">
      {items.map(({ s, l, i }) => (
        <button key={s} onClick={() => onNav(s)} className={`flex-1 flex flex-col items-center justify-center border-b-2 transition ${current === s ? 'border-black' : 'border-transparent'}`}>
          <span className="text-xl">{i}</span>
          <span className="text-xs font-medium">{l}</span>
        </button>
      ))}
    </nav>
  )
}
