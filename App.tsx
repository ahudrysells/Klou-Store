import { useMemo, useState } from 'react'
import { ShoppingCart, ScanLine, CreditCard, Banknote, Gift, PackagePlus, Trash2 } from 'lucide-react'

type PaymentMethod = 'Cash' | 'Card' | 'Whatnot' | 'Gift'
type CartItem = { id: string; name: string; code: string; price: number; quantity: number }

const sampleProducts: CartItem[] = [
  { id: '1', name: 'Clothing item', code: 'KLOW10', price: 10, quantity: 1 },
  { id: '2', name: 'Beach special', code: 'BEACH10', price: 10, quantity: 1 },
]

function money(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [code, setCode] = useState('')
  const [customPrice, setCustomPrice] = useState('10')
  const [lastPayment, setLastPayment] = useState<PaymentMethod | null>(null)

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

  function addItem(scannedCode = code) {
    const cleanCode = scannedCode.trim() || `ITEM-${Date.now()}`
    const product = sampleProducts.find((item) => item.code.toLowerCase() === cleanCode.toLowerCase())
    const price = Number(customPrice) || 10
    const newItem = product ?? { id: cleanCode, name: `Item ${cleanCode}`, code: cleanCode, price, quantity: 1 }

    setCart((items) => {
      const existing = items.find((item) => item.code === newItem.code)
      if (existing) {
        return items.map((item) => item.code === newItem.code ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...items, { ...newItem, id: `${newItem.code}-${Date.now()}`, quantity: 1 }]
    })
    setCode('')
  }

  function pay(method: PaymentMethod) {
    setLastPayment(method)
    if (method === 'Card') {
      window.open('https://squareup.com/dashboard', '_blank', 'noopener,noreferrer')
    }
  }

  function removeItem(id: string) {
    setCart((items) => items.filter((item) => item.id !== id))
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Flea Market POS</p>
            <h1 className="text-2xl font-black">Klou Store</h1>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-lg">
            <ShoppingCart size={22} />
            <span className="font-bold">{count}</span>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center gap-2">
              <ScanLine className="text-blue-600" />
              <h2 className="text-xl font-black">Scan or enter item</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_120px_auto]">
              <input
                className="rounded-2xl border border-slate-300 px-4 py-4 text-lg outline-none focus:border-blue-600"
                placeholder="Barcode / SKU"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && addItem()}
              />
              <input
                className="rounded-2xl border border-slate-300 px-4 py-4 text-lg outline-none focus:border-blue-600"
                placeholder="Price"
                inputMode="decimal"
                value={customPrice}
                onChange={(event) => setCustomPrice(event.target.value)}
              />
              <button onClick={() => addItem()} className="rounded-2xl bg-blue-600 px-6 py-4 font-black text-white shadow-md hover:bg-blue-700">
                Add
              </button>
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-4 font-bold text-slate-700">
              <PackagePlus size={20} /> Camera barcode scanner placeholder
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(['Cash', 'Card', 'Whatnot', 'Gift'] as PaymentMethod[]).map((method) => {
              const Icon = method === 'Cash' ? Banknote : method === 'Card' ? CreditCard : method === 'Gift' ? Gift : ShoppingCart
              return (
                <button key={method} onClick={() => pay(method)} className="rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-200 hover:ring-blue-500">
                  <Icon className="mb-4 text-blue-600" size={28} />
                  <p className="font-black">{method}</p>
                </button>
              )
            })}
          </div>

          {lastPayment && (
            <div className="rounded-2xl bg-green-50 p-4 font-semibold text-green-800 ring-1 ring-green-200">
              Payment selected: {lastPayment}. Total: {money(total)}
            </div>
          )}
        </div>

        <aside className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Cart</h2>
            <button onClick={() => setCart([])} className="text-sm font-bold text-red-600">Clear</button>
          </div>

          <div className="space-y-3">
            {cart.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-8 text-center font-semibold text-slate-500">No items scanned yet.</p>
            ) : cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-black">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.code} × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-black">{money(item.price * item.quantity)}</p>
                  <button onClick={() => removeItem(item.id)} className="rounded-xl bg-red-50 p-2 text-red-600"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Total</p>
            <p className="text-4xl font-black">{money(total)}</p>
          </div>
        </aside>
      </section>
    </main>
  )
}
