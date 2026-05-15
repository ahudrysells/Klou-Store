import React from 'react'

export default function Keypad({ onKey, onDel }: { onKey: (k: string) => void; onDel: () => void }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0']
  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.map(k => <button key={k} onClick={() => onKey(k)} className="p-3 bg-gray-100 hover:bg-gray-200 rounded font-bold text-lg">{k}</button>)}
      <button onClick={onDel} className="col-span-1 p-3 bg-red-500 text-white rounded font-bold">⌫</button>
    </div>
  )
}
