import { useStore } from './store/useStore'
import Navigation from './components/Navigation'
import HomeScreen from './screens/HomeScreen'
import CartScreen from './screens/CartScreen'
import PaymentScreen from './screens/PaymentScreen'
import ScannerScreen from './screens/ScannerScreen'
import InventoryScreen from './screens/InventoryScreen'
import TransactionsScreen from './screens/TransactionsScreen'

export default function App() {
  const { currentScreen } = useStore()

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col max-w-lg mx-auto overflow-hidden">
      <main className="flex-1 overflow-hidden relative">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'cart' && <CartScreen />}
        {currentScreen === 'payment' && <PaymentScreen />}
        {currentScreen === 'scanner' && <ScannerScreen />}
        {currentScreen === 'inventory' && <InventoryScreen />}
        {currentScreen === 'transactions' && <TransactionsScreen />}
      </main>
      <Navigation />
    </div>
  )
}
