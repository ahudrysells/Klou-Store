import { useState } from 'react'
import { Scan, Plus, CheckCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Product } from '../types'

export default function ScannerScreen() {
  const { products, addToCart, addProduct } = useStore()
  const [code, setCode] = useState('')
  const [found, setFound] = useState<Product | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [added, setAdded] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' })

  const handleSearch = () => {
    const product = products.find((p) => p.barcode === code.trim())
    if (product) {
      setFound(product)
      setNotFound(false)
    } else {
      setFound(null)
      setNotFound(true)
    }
    setAdded(false)
  }

  const handleAddToCart = () => {
    if (!found) return
    addToCart(found)
    setAdded(true)
    setCode('')
    setFound(null)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleCreateProduct = () => {
    const price = parseFloat(newProduct.price)
    const stock = parseInt(newProduct.stock) || 0
    if (!newProduct.name || isNaN(price)) return
    const product: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      price,
      stock,
      barcode: code,
    }
    addProduct(product)
    addToCart(product)
    setNewProduct({ name: '', price: '', stock: '' })
    setCode('')
    setNotFound(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-4 pt-10 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Scanner</h1>
        <p className="text-sm text-gray-500">Ingresa código manualmente</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {added && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            <span className="text-green-700 text-sm font-medium">¡Agregado al carrito!</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Scan size={18} className="text-blue-600" />
            <p className="text-sm font-medium text-gray-600">Código de barras</p>
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Ej: 123456789" value={code}
              onChange={(e) => { setCode(e.target.value); setFound(null); setNotFound(false) }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
            <button onClick={handleSearch}
              className="bg-blue-600 text-white rounded-xl px-4 py-2.5 font-medium hover:bg-blue-700 transition-colors text-sm">
              Buscar
            </button>
          </div>
        </div>

        {found && (
          <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-4">
            <p className="text-xs text-blue-600 font-medium mb-1">✅ Producto encontrado</p>
            <p className="font-bold text-gray-800">{found.name}</p>
            <p className="text-blue-600 font-bold text-lg">${found.price.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mb-3">Stock: {found.stock}</p>
            <button onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
              <Plus size={16} /> Agregar al carrito
            </button>
          </div>
        )}

        {notFound && (
          <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-4">
            <p className="text-xs text-orange-600 font-medium mb-3">⚠️ Código no encontrado — crear nuevo producto</p>
            <div className="space-y-2">
              <input type="text" placeholder="Nombre del producto" value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
              <div className="flex gap-2">
                <input type="number" placeholder="Precio $" value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                <input type="number" placeholder="Stock" value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
              </div>
              <button onClick={handleCreateProduct}
                className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors">
                <Plus size={16} /> Crear y agregar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
