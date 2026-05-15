import { useState } from 'react'
import { Plus, Pencil, Trash2, Package, X, Check } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Product } from '../types'

const EMPTY: Omit<Product, 'id'> = { name: '', price: 0, stock: 0, barcode: '', category: '' }

export default function InventoryScreen() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore()
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY)

  const startEdit = (p: Product) => {
    setEditing(p.id)
    setForm({ name: p.name, price: p.price, stock: p.stock, barcode: p.barcode || '', category: p.category || '' })
    setCreating(false)
  }

  const saveEdit = () => {
    if (!editing || !form.name) return
    updateProduct(editing, form)
    setEditing(null)
  }

  const handleCreate = () => {
    if (!form.name || form.price <= 0) return
    addProduct({ ...form, id: `prod-${Date.now()}` })
    setCreating(false)
    setForm(EMPTY)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-4 pt-10 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Inventario</h1>
            <p className="text-sm text-gray-500">{products.length} productos</p>
          </div>
          <button onClick={() => { setCreating(true); setEditing(null); setForm(EMPTY) }}
            className="bg-blue-600 text-white rounded-xl px-3 py-2 flex items-center gap-1.5 text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Nuevo
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        {creating && (
          <ProductForm form={form} setForm={setForm} onSave={handleCreate} onCancel={() => setCreating(false)} label="Crear producto" />
        )}

        {products.map((product) => (
          editing === product.id ? (
            <ProductForm key={product.id} form={form} setForm={setForm} onSave={saveEdit} onCancel={() => setEditing(null)} label="Guardar" />
          ) : (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package size={18} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{product.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-blue-600 font-bold text-sm">${product.price.toFixed(2)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    product.stock > 10 ? 'bg-green-100 text-green-700' :
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    Stock: {product.stock}
                  </span>
                </div>
                {product.barcode && <p className="text-xs text-gray-400 mt-0.5">#{product.barcode}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(product)} className="text-gray-400 hover:text-blue-600 p-1.5">
                  <Pencil size={16} />
                </button>
                <button onClick={() => deleteProduct(product.id)} className="text-gray-400 hover:text-red-500 p-1.5">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

function ProductForm({ form, setForm, onSave, onCancel, label }: {
  form: Omit<Product, 'id'>
  setForm: (f: Omit<Product, 'id'>) => void
  onSave: () => void
  onCancel: () => void
  label: string
}) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
      <input type="text" placeholder="Nombre *" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
      <div className="flex gap-2">
        <input type="number" placeholder="Precio *" value={form.price || ''}
          onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
        <input type="number" placeholder="Stock" value={form.stock || ''}
          onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
      </div>
      <div className="flex gap-2">
        <input type="text" placeholder="Código de barras" value={form.barcode || ''}
          onChange={(e) => setForm({ ...form, barcode: e.target.value })}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
        <input type="text" placeholder="Categoría" value={form.category || ''}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onSave} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors text-sm">
          <Check size={14} /> {label}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
