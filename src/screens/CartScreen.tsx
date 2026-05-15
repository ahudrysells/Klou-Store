import React from 'react';
import Header from '../components/Header';
import CartItemCard from '../components/CartItemCard';
import Button from '../components/Button';
import { useCartStore } from '../store';
import { Screen } from '../types';

interface CartScreenProps {
  onNavigate: (screen: Screen) => void;
}

const CartScreen: React.FC<CartScreenProps> = ({ onNavigate }) => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotals = useCartStore((state) => state.getTotals);

  const totals = getTotals();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <Header cartCount={0} onCartClick={() => onNavigate('home')} />
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header cartCount={cartCount} onCartClick={() => onNavigate('home')} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-8">Carrito</h2>

        {/* Items */}
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <CartItemCard
              key={item.productId}
              item={item}
              onRemove={removeItem}
              onQuantityChange={updateQuantity}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Impuesto (7.5%):</span>
              <span className="font-semibold">${totals.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between text-xl">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-blue-600">${totals.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => onNavigate('payment')}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Proceder al Pago
            </Button>
            <Button
              onClick={() => onNavigate('home')}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Continuar Comprando
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartScreen;
