import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Header from '../components/Header';
import Keypad from '../components/Keypad';
import Button from '../components/Button';
import { useCartStore, useProductStore } from '../store';
import { CartItem, Screen } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addItem);
  const getTotals = useCartStore((state) => state.getTotals);
  const products = useProductStore((state) => state.products);

  const totals = getTotals();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleKeyPress = (key: string) => {
    if (key === '.' && amount.includes('.')) return;
    setAmount(amount + key);
  };

  const handleDelete = () => {
    setAmount(amount.slice(0, -1));
  };

  const handleAddToCart = () => {
    const price = parseFloat(amount);
    if (isNaN(price) || price <= 0) {
      alert('Ingresa un monto válido');
      return;
    }

    const cartItem: CartItem = {
      id: Date.now().toString(),
      productId: Date.now().toString(),
      name: 'Venta Manual',
      price: price,
      quantity: 1,
      subtotal: price,
    };

    addToCart(cartItem);
    setAmount('');
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (product) => {
    const cartItem: CartItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      subtotal: product.price,
    };
    addToCart(cartItem);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header cartCount={cartCount} onCartClick={() => onNavigate('cart')} />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Total Display */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center">
          <p className="text-gray-600 text-sm mb-2">Total</p>
          <h2 className="text-5xl font-bold text-blue-600">${totals.total.toFixed(2)}</h2>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Quick Products */}
        {filteredProducts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-2">Stock: {product.stock}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manual Entry */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h3 className="text-lg font-semibold mb-6">Ingreso Manual</h3>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-center border-2 border-gray-200">
            <p className="text-5xl font-bold text-gray-900">${amount || '0.00'}</p>
          </div>

          <div className="mb-6">
            <Keypad onKeyPress={handleKeyPress} onDelete={handleDelete} />
          </div>

          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Agregar al Carrito
          </Button>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
