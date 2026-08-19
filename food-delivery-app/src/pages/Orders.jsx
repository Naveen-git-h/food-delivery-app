import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Orders = () => {
  const navigate = useNavigate()
  const { addItem, items: cartItems, clearCart } = useCart()
  const [orders] = useState(() =>
    JSON.parse(localStorage.getItem('orders') || '[]').reverse()
  )
  const [expandedId, setExpandedId] = useState(null)

  const handleReorder = (order) => {
    if (cartItems.length > 0 && cartItems[0].restaurantId !== order.items[0]?.restaurantId) {
      clearCart()
    }
    order.items.forEach((item) => {
      addItem({ ...item, id: `${item.menuItemId}-${Date.now()}-${Math.random()}` })
    })
    navigate('/cart')
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-gray-500 mb-4">No orders found.</p>
        <button
          onClick={() => navigate('/restaurants')}
          className="px-4 py-2 bg-orange-600 text-white rounded-md"
        >
          Browse Restaurants
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4">
      <h1 className="text-xl font-bold mb-4">Order History</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.orderId} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">Order #{order.orderId}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.placedAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full capitalize">
                {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              {order.items.length} item(s) • ₹{order.total}
            </p>

            {expandedId === order.orderId && (
              <div className="mt-2 space-y-1 text-sm text-gray-600 border-t pt-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.quantity} × {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setExpandedId(expandedId === order.orderId ? null : order.orderId)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              >
                {expandedId === order.orderId ? 'Hide Details' : 'View Details'}
              </button>
              <button
                onClick={() => handleReorder(order)}
                className="flex-1 px-3 py-1.5 bg-orange-600 text-white rounded-md text-sm"
              >
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders