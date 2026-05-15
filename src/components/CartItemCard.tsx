import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';

interface CartItemCardProps {
  item: CartItem;
  onRemove: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove, onQuantityChange }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-3 mx-4">
        <button
          onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Minus size={18} />
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right min-w-20">
          <p className="font-bold text-blue-600">${item.subtotal.toFixed(2)}</p>
        </div>
        <button
          onClick={() => onRemove(item.productId)}
          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
