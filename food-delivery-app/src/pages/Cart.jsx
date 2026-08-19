import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { coupons } from '../data/coupons'

const DELIVERY_FEE = 40
const TAX_RATE = 0.05

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  const handleApplyCoupon = () => {
    setCouponError('')
    setCouponSuccess('')
    const found = coupons.find((c) => c.code === couponCode.trim().toUpperCase())

    if (!found) {
      setCouponError('Invalid coupon code')
      return
    }
    if (found.expired) {
      setCouponError('This coupon has expired')
      return
    }
    if (subtotal < found.minOrder) {
      setCouponError(`Minimum order of ₹${found.minOrder} required for this coupon`)
      return
    }

    setAppliedCoupon(found)
    setCouponSuccess(`Coupon applied: ${found.description}`)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponSuccess('')
    setCouponError('')
  }

  let discount = 0
  let deliveryFee = DELIVERY_FEE
  if (appliedCoupon) {
    if (appliedCoupon.type === 'flat') {
      discount = appliedCoupon.value
    } else if (appliedCoupon.type === 'percent') {
      discount = Math.min(
        (subtotal * appliedCoupon.value) / 100,
        appliedCoupon.maxDiscount || Infinity
      )
    } else if (appliedCoupon.type === 'freeDelivery') {
      deliveryFee = 0
    }
  }

  const tax = Math.round(subtotal * TAX_RATE)
  const total = Math.round(subtotal + deliveryFee + tax - discount)

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-lg font-medium text-gray-700">Your cart is empty</p>
        <p className="text-sm text-gray-500 mt-1 mb-4">Add some delicious food to get started</p>
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
    <div className="min-h-screen bg-gray-50 px-4 py-4 pb-40">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Your Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-600">
          Clear Cart
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm p-3">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                {item.addons?.length > 0 && (
                  <p className="text-xs text-gray-500">Add-ons: {item.addons.join(', ')}</p>
                )}
                {item.instructions && (
                  <p className="text-xs text-gray-400 italic">"{item.instructions}"</p>
                )}
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm">
                Remove
              </button>
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-3 border border-gray-300 rounded-md px-2 py-1">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <span className="font-semibold">₹{item.price * item.quantity}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
        <h3 className="font-medium mb-2">Coupon</h3>
        {appliedCoupon ? (
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-700">{couponSuccess}</span>
            <button onClick={removeCoupon} className="text-sm text-red-500">Remove</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <button onClick={handleApplyCoupon} className="px-3 py-2 bg-orange-600 text-white rounded-md text-sm">
              Apply
            </button>
          </div>
        )}
        {couponError && <p className="text-sm text-red-600 mt-2">{couponError}</p>}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-3 mb-4 space-y-1 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div className="flex justify-between"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
        <div className="flex justify-between"><span>Taxes</span><span>₹{tax}</span></div>
        {discount > 0 && (
          <div className="flex justify-between text-green-700"><span>Discount</span><span>−₹{Math.round(discount)}</span></div>
        )}
        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
          <span>Total</span><span>₹{total}</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3 bg-orange-600 text-white rounded-md font-medium"
        >
          Proceed to Checkout — ₹{total}
        </button>
      </div>
    </div>
  )
}

export default Cart