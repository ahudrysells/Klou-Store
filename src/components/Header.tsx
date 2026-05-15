import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🚀</div>
          <h1 className="text-2xl font-bold text-black">Klou Store</h1>
        </div>

        <button
          onClick={onCartClick}
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ShoppingCart size={28} className="text-black" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
