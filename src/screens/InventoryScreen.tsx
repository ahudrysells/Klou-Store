import React, { useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useProductStore } from '../store';
import { Product, Screen } from '../types';
import { Trash2, Edit2 } from 'lucide-react';

interface InventoryScreenProps {
  onNavigate: (screen: Screen) => void;
}

const InventoryScreen: React.FC<InventoryScreenProps> = ({ onNavigate }) => {
  const products = useProductStore((state) => state.products);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    barcode: '',
    price: 10,
    stock: 0,
  });

  const handleAddProduct = () => {
    if (!formData.name || !formData.sku || !formData.barcode) {
      alert('Completa todos los campos');
      return;
    }

    if (editingId) {
      updateProduct(editingId, formData);
      alert('Producto actualizado');
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        sku: formData.sku,
        barcode: formData.barcode,
        price: formData.price || 10,
        stock: formData.stock || 0,
        createdAt: new Date().toISOString(),
      };
      addProduct(newProduct);
      alert('Producto agregado');
    }

    resetForm();
  };

  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      deleteProduct(id);
      alert('Producto eliminado');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', sku: '', barcode: '', price: 10, stock: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header cartCount={0} onCartClick={() => onNavigate('home')} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {!showForm ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Inventario</h2>
              <Button onClick={() => setShowForm(true)} variant="primary">
                + Nuevo Producto
              </Button>
            </div>

            <div className="text-gray-600 mb-6">{products.length} productos</div>

            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      SKU: {product.sku} | Código: {product.barcode}
                    </p>
                    <div className="flex gap-4 mt-3">
                      <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
                      <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={20} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-8">
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>

            <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  placeholder="SKU/Código interno"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Barras *
                </label>
                <input
                  type="text"
                  placeholder="Código de barras"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddProduct}
                  variant="primary"
                  className="flex-1"
                >
                  Guardar
                </Button>
                <Button
                  onClick={resetForm}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default InventoryScreen;
