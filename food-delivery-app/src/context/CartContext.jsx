import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  const [restaurantId, setRestaurantId] = useState(() => {
    const saved = localStorage.getItem('cartRestaurantId')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
    localStorage.setItem('cartRestaurantId', JSON.stringify(restaurantId))
  }, [items, restaurantId])

  // cartItem shape: { id (unique per line), menuItemId, restaurantId, name, price, quantity, size, addons, instructions }
  const addItem = (item) => {
    setItems((prev) => [...prev, item])
    setRestaurantId(item.restaurantId)
  }

  const removeItem = (cartItemId) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== cartItemId)
      if (updated.length === 0) setRestaurantId(null)
      return updated
    })
  }

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => {
    setItems([])
    setRestaurantId(null)
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const value = {
    items,
    restaurantId,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}