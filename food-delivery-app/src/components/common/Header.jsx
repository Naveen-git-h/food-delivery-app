import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const Header = () => {
  const { items } = useCart()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/restaurants', label: 'Restaurants' },
    { to: '/orders', label: 'My Orders' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-orange-600">
          FoodieExpress
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium ${
                isActive(link.to) ? 'text-orange-600' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/cart" className="relative text-sm font-medium text-gray-600">
            🛒 Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-orange-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile: cart icon + hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          <Link to="/cart" className="relative">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl leading-none">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="sm:hidden flex flex-col border-t px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`py-2 text-sm font-medium ${
                isActive(link.to) ? 'text-orange-600' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

export default Header