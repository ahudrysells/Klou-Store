import React, { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { useProductStore } from '../store'
import { Product, Screen } from '../types'

export default function Inventory({ onNav }: { onNav: (s: Screen) => void }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Product>>({ name: '', sku: '', barcode: '', price: 10, stock: 0 })
  const products = useProductStore()
  
  const handleSave = () => {
    if (!form.name || !form.sku || !form.barcode) { alert('Completa todos los campos'); return }
    if (editing) {
      products.update(editing, form)
      alert('✅ Actualizado')
    } else {
      products.add({ id: Date.now().toString(), name: form.name!, sku: form.sku!, barcode: form.barcode!, price: form.price || 10, stock: form.stock || 0, createdAt: new Date().toISOString() })
      alert('✅ Agregado')
    }
    resetForm()
  }
  
  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      products.delete(id)
      alert('✅ Eliminado')
    }
  }
  
  const resetForm = () => {
    setForm({ name: '', sku: '', barcode: '', price: 10, stock: 0 })
    setEditing(null)
    setShowForm(false)
  }
  
  if (showForm) return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header count={0} onCart={() => {}} />
      <main className="max-w-2xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold mb-6">{editing ? 'Editar' : 'Nuevo'} Producto</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <input type="text" placeholder="Nombre *" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
          <input type="text" placeholder="SKU *" value={form.sku || ''} onChange={e => setForm({ ...form, sku: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
          <input type="text" placeholder="Código *" value={form.barcode || ''} onChange={e => setForm({ ...form, barcode: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Precio" value={form.price || ''} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} className="px-4 py-2 border border-gray-200 rounded-lg" />
            <input type="number" placeholder="Stock" value={form.stock || ''} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) })} className="px-4 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">Guardar</Button>
            <Button onClick={resetForm} variant="secondary" className="flex-1">Cancelar</Button>
          </div>
        </div>
      </main>
    </div>
  )
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header count={0} onCart={() => {}} />
      <main className="max-w-2xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Inventario</h2>
          <Button onClick={() => setShowForm(true)} size="sm">+ Nuevo</Button>
        </div>
        <p className="text-gray-600 mb-4">{products.products.length} productos</p>
        <div className="space-y-3">
          {products.products.slice(0, 50).map(p => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
              <div className="flex-1">
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-xs text-gray-500">SKU: {p.sku} | Código: {p.barcode}</p>
                <div className="flex gap-4 mt-2">
                  <p className="text-blue-600 font-bold text-sm">${p.price}</p>
                  <p className={`font-semibold text-sm ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>Stock: {p.stock}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(p.id); setForm(p); setShowForm(true) }} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Editar</button>
                <button onClick={() => handleDelete(p.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Borrar</button>
              </div>
            </div>
          ))}
        </div>
        {products.products.length > 50 && <p className="text-center text-gray-500 text-sm mt-4">Mostrando 50 de {products.products.length} productos</p>}
      </main>
    </div>
  )
}
