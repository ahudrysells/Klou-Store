import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import PaymentScreen from './screens/PaymentScreen';
import ScannerScreen from './screens/ScannerScreen';
import InventoryScreen from './screens/InventoryScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import Navigation from './components/Navigation';
import { Screen } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case 'cart':
        return <CartScreen onNavigate={setCurrentScreen} />;
      case 'payment':
        return <PaymentScreen onNavigate={setCurrentScreen} />;
      case 'scanner':
        return <ScannerScreen onNavigate={setCurrentScreen} />;
      case 'inventory':
        return <InventoryScreen onNavigate={setCurrentScreen} />;
      case 'transactions':
        return <TransactionsScreen onNavigate={setCurrentScreen} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}
      <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
}

export default App;
