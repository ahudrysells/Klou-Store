import React from 'react';
import Header from '../components/Header';
import { useTransactionStore } from '../store';
import { Screen } from '../types';

interface TransactionsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ onNavigate }) => {
  const transactions = useTransactionStore((state) => state.transactions);
  const getTotalSales = useTransactionStore((state) => state.getTotalSales);

  const totalSales = getTotalSales();
  const todayDate = new Date().toLocaleDateString();
  const todayTransactions = transactions.filter((t) => t.date === todayDate);
  const todayTotal = todayTransactions.reduce((sum, t) => sum + t.total, 0);

  const getPaymentEmoji = (method: string) => {
    const map: { [key: string]: string } = {
      cash: '💵',
      card: '💳',
      whatnot: '📺',
      gift: '🎁',
    };
    return map[method] || '💳';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header cartCount={0} onCartClick={() => onNavigate('home')} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-8">Transacciones</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm mb-2">Hoy</p>
            <p className="text-3xl font-bold text-blue-600">${todayTotal.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">{todayTransactions.length} transacciones</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-600 text-sm mb-2">Total Histórico</p>
            <p className="text-3xl font-bold text-blue-600">${totalSales.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">{transactions.length} transacciones</p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <p className="text-5xl mb-4">📊</p>
            <p className="text-gray-500 text-lg">Sin transacciones</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions
              .slice()
              .reverse()
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {getPaymentEmoji(transaction.paymentMethod)}
                      </span>
                      <div>
                        <p className="font-bold uppercase">
                          {transaction.paymentMethod}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      ${transaction.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {transaction.items.length} items
                    </p>
                    <div className="text-xs text-gray-500 space-y-1">
                      {transaction.items.map((item, idx) => (
                        <p key={idx}>
                          • {item.name} x{item.quantity}
                        </p>
                      ))}
                    </div>
                  </div>

                  {transaction.paymentMethod === 'cash' && transaction.change !== undefined && (
                    <div className="border-t border-gray-200 mt-4 pt-4 text-xs text-gray-600">
                      <p>
                        Efectivo: ${transaction.cashReceived?.toFixed(2)} | Cambio: $
                        {transaction.change.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TransactionsScreen;
