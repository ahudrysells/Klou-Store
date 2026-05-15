import React, { useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useCartStore, useTransactionStore } from '../store';
import { PaymentMethod, Screen } from '../types';

interface PaymentScreenProps {
  onNavigate: (screen: Screen) => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onNavigate }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cashReceived, setCashReceived] = useState('');

  const items = useCartStore((state) => state.items);
  const getTotals = useCartStore((state) => state.getTotals);
  const clearCart = useCartStore((state) => state.clearCart);
  const addTransaction = useTransactionStore((state) => state.addTransaction);

  const totals = getTotals();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const change = cashReceived ? parseFloat(cashReceived) - totals.total : 0;

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Selecciona un método de pago');
      return;
    }

    if (selectedMethod === 'cash' && parseFloat(cashReceived) < totals.total) {
      alert('El efectivo es insuficiente');
      return;
    }

    const transaction = {
      id: Date.now().toString(),
      items: items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      paymentMethod: selectedMethod,
      cashReceived: selectedMethod === 'cash' ? parseFloat(cashReceived) : undefined,
      change: selectedMethod === 'cash' ? change : undefined,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    };

    addTransaction(transaction);
    clearCart();

    alert(`✅ Pago Completado\nMétodo: ${selectedMethod.toUpperCase()}\nTotal: $${totals.total.toFixed(2)}`);
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header cartCount={cartCount} onCartClick={() => onNavigate('cart')} />

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Amount Summary */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Impuesto:</span>
              <span className="font-semibold">${totals.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between text-2xl">
              <span className="font-bold">Total a Pagar:</span>
              <span className="font-bold text-blue-600">${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Método de Pago</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { method: 'cash' as PaymentMethod, icon: '💵', label: 'CASH' },
              { method: 'whatnot' as PaymentMethod, icon: '📺', label: 'WHATNOT' },
              { method: 'card' as PaymentMethod, icon: '💳', label: 'CARD' },
              { method: 'gift' as PaymentMethod, icon: '🎁', label: 'GIFT' },
            ].map(({ method, icon, label }) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedMethod === method
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-2">{icon}</div>
                <div className="font-bold">{label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cash Details */}
        {selectedMethod === 'cash' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Efectivo Recibido
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-2xl font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            {cashReceived && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Cambio:</span>
                  <span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${change.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Messages */}
        {selectedMethod === 'whatnot' && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900">Se registrará como venta Whatnot/livestream.</p>
          </div>
        )}

        {selectedMethod === 'card' && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900">Se abrirá la pasarela de pago de Square.</p>
          </div>
        )}

        {selectedMethod === 'gift' && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900">Se registrará como regalo/promoción.</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handlePayment}
            disabled={!selectedMethod}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Confirmar Pago
          </Button>
          <Button
            onClick={() => onNavigate('cart')}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PaymentScreen;
