import React from 'react';
import { CreditCard, Package, BarChart3, Bell, MoreHorizontal } from 'lucide-react';
import { Screen } from '../types';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const navItems: { screen: Screen; label: string; icon: React.ReactNode }[] = [
    { screen: 'home', label: 'Checkout', icon: <CreditCard size={24} /> },
    { screen: 'inventory', label: 'Inventory', icon: <Package size={24} /> },
    { screen: 'transactions', label: 'Transactions', icon: <BarChart3 size={24} /> },
    { screen: 'scanner', label: 'Scanner', icon: <Bell size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-20">
      {navItems.map((item) => (
        <button
          key={item.screen}
          onClick={() => onNavigate(item.screen)}
          className={`flex flex-col items-center justify-center gap-1 px-6 py-2 border-b-2 transition-colors ${
            currentScreen === item.screen
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          {item.icon}
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
      <button className="flex flex-col items-center justify-center gap-1 px-6 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-900 transition-colors">
        <MoreHorizontal size={24} />
        <span className="text-xs font-medium">More</span>
      </button>
    </nav>
  );
};

export default Navigation;
