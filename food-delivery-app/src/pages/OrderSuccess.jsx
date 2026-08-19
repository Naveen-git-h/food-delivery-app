import { useNavigate } from 'react-router-dom'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const order = JSON.parse(localStorage.getItem('lastOrder') || 'null')

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-gray-500 mb-4">No recent order found.</p>
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-4">
        ✅
      </div>
      <h1 className="text-xl font-bold text-center">Order Placed Successfully!</h1>
      <p className="text-gray-500 text-sm mt-1">Order #{order.orderId}</p>

      <div className="bg-white rounded-lg shadow-sm p-4 w-full max-w-md mt-6">
        <h2 className="font-semibold mb-2">Order Items</h2>
        <div className="space-y-1 text-sm mb-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-600">
              <span>{item.quantity} × {item.name}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>

        <div className="border-t mt-3 pt-3 text-sm text-gray-600 space-y-1">
          <p className="font-medium text-gray-800">Delivery Address</p>
          <p>{order.address.fullName}, {order.address.phone}</p>
          <p>{order.address.house}, {order.address.street}, {order.address.area}</p>
          <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
        </div>

        <div className="border-t mt-3 pt-3 text-sm text-gray-600 flex justify-between">
          <span>Estimated Delivery</span>
          <span className="font-medium">{order.estimatedDelivery}</span>
        </div>
      </div>

      <button
        onClick={() => navigate(`/track-order/${order.orderId}`)}
        className="w-full max-w-md py-3 bg-orange-600 text-white rounded-md font-medium mt-6"
      >
        Track Order
      </button>
    </div>
  )
}

export default OrderSuccess