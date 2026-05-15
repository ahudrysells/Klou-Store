import { useState } from 'react'
import { Search, Plus, ShoppingCart, Package } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function HomeScreen() {
  const { products, addToCart, setScreen, cartCount } = useStore()
  const [search, setSearch] = useState('')
  const [manualPrice, setManualPrice] = useState('')
  const [manualName, setManualName] = useState('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search))
  )

  const handleManualAdd = () => {
    const price = parseFloat(manualPrice)
    if (!manualName || isNaN(price)) return
    addToCart({ id: `manual-${Date.now()}`, name: manualName, price, stock: 999 })
    setManualName('')
    setManualPrice('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-blue-600 text-white px-4 pt-10 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold">Klou Store</h1>
            <p className="text-blue-200 text-sm">POS System</p>
          </div>
          <button onClick={() => setScreen('cart')} className="relative bg-white/20 rounded-full p-2">
            <ShoppingCart size={22} />
            {cartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount()}
              </span>
            )}
          </button>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
          <input
            type="text"
            placeholder="Buscar producto o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/20 text-white placeholder-blue-300 rounded-xl text-sm outline-none focus:bg-white/30"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="font-semibold text-gray-700 mb-3 text-sm">Entrada manual</h2>
          <div className="flex gap-2">
            <input type="text" placeholder="Nombre del producto" value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400" />
            <input type="number" placeholder="$0.00" value={manualPrice}
              onChange={(e) => setManualPrice(e.target.value)}
              className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400" />
            <button onClick={handleManualAdd} className="bg-blue-600 text-white rounded-xl px-3 py-2 hover:bg-blue-700">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-2 text-sm">Productos ({filtered.length})</h2>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <button key={product.id} onClick={() => addToCart(product)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 text-left hover:border-blue-300 hover:shadow-md transition-all active:scale-95">
                <div className="w-full h-16 bg-gray-100 rounded-xl mb-2 flex items-center justify-center">
                  <Package size={24} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                <p className="text-blue-600 font-bold text-sm">${product.price.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Stock: {product.stock}</p>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Search size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
