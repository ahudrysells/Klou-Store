import React from 'react'

export default function Header({ count, onCart }: { count: number; onCart: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🚀 Klou Store</h1>
        <button onClick={onCart} className="relative p-2 hover:bg-gray-100 rounded">
          <span className="text-2xl">🛒</span>
          {count > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{count}</span>}
        </button>
      </div>
    </header>
  )
}
