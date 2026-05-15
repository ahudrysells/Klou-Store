import { Home, ShoppingCart, CreditCard, Scan, Package, Receipt } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Screen } from '../types'

const NAV_ITEMS: { screen: Screen; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { screen: 'home', label: 'Inicio', Icon: Home },
  { screen: 'cart', label: 'Carrito', Icon: ShoppingCart },
  { screen: 'payment', label: 'Pago', Icon: CreditCard },
  { screen: 'scanner', label: 'Scanner', Icon: Scan },
  { screen: 'inventory', label: 'Inventario', Icon: Package },
  { screen: 'transactions', label: 'Ventas', Icon: Receipt },
]

export default function Navigation() {
  const { currentScreen, setScreen, cartCount } = useStore()
  const count = cartCount()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map(({ screen, label, Icon }) => {
          const active = currentScreen === screen
          return (
            <button
              key={screen}
              onClick={() => setScreen(screen)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative transition-colors ${
                active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon size={22} />
                {screen === 'cart' && count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-b" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
