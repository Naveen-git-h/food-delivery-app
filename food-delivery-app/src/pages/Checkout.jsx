import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const DELIVERY_FEE = 40
const TAX_RATE = 0.05

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    house: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home',
  })
  const [errors, setErrors] = useState({})
  const [deliveryInstruction, setDeliveryInstruction] = useState('Leave at door')
  const [paymentMethod, setPaymentMethod] = useState('COD')

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) newErrors.phone = 'Enter a valid 10-digit phone number'
    if (!form.house.trim()) newErrors.house = 'House/flat number is required'
    if (!form.street.trim()) newErrors.street = 'Street is required'
    if (!form.area.trim()) newErrors.area = 'Area is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.state.trim()) newErrors.state = 'State is required'
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Enter a valid 6-digit PIN code'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = () => {
    if (!validate()) return

    const tax = Math.round(subtotal * TAX_RATE)
    const total = Math.round(subtotal + DELIVERY_FEE + tax)
    const orderId = 'FD' + Math.floor(100000 + Math.random() * 900000)

    const order = {
      orderId,
      items,
      restaurantName: 'Your Order',
      total,
      address: form,
      deliveryInstruction,
      paymentMethod,
      estimatedDelivery: '25-35 minutes',
      status: 'confirmed',
      placedAt: Date.now(),
    }

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    localStorage.setItem('orders', JSON.stringify([...existingOrders, order]))
    localStorage.setItem('lastOrder', JSON.stringify(order))

    clearCart()
    navigate('/order-success')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <p className="text-gray-500">Your cart is empty. Add items before checking out.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4 pb-24">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>

      {/* Address form */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h2 className="font-semibold mb-3">Delivery Address</h2>
        <div className="space-y-3">
          <Field label="Full Name" value={form.fullName} onChange={(v) => handleChange('fullName', v)} error={errors.fullName} />
          <Field label="Phone Number" value={form.phone} onChange={(v) => handleChange('phone', v)} error={errors.phone} type="tel" />
          <Field label="House/Flat Number" value={form.house} onChange={(v) => handleChange('house', v)} error={errors.house} />
          <Field label="Street" value={form.street} onChange={(v) => handleChange('street', v)} error={errors.street} />
          <Field label="Area" value={form.area} onChange={(v) => handleChange('area', v)} error={errors.area} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" value={form.city} onChange={(v) => handleChange('city', v)} error={errors.city} />
            <Field label="State" value={form.state} onChange={(v) => handleChange('state', v)} error={errors.state} />
          </div>
          <Field label="PIN Code" value={form.pincode} onChange={(v) => handleChange('pincode', v)} error={errors.pincode} />

          <div>
            <label className="text-sm text-gray-600 block mb-1">Address Type</label>
            <div className="flex gap-2">
              {['Home', 'Work', 'Other'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleChange('addressType', type)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    form.addressType === type ? 'bg-orange-600 text-white border-orange-600' : 'border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery instructions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h2 className="font-semibold mb-3">Delivery Instructions</h2>
        <div className="space-y-2">
          {['Leave at door', 'Meet at door', 'Call when arriving'].map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={deliveryInstruction === option}
                onChange={() => setDeliveryInstruction(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h2 className="font-semibold mb-3">Payment Method</h2>
        <div className="space-y-2">
          {[
            { id: 'CARD', label: 'Credit/Debit Card' },
            { id: 'UPI', label: 'UPI' },
            { id: 'COD', label: 'Cash on Delivery' },
          ].map((method) => (
            <label key={method.id} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={paymentMethod === method.id}
                onChange={() => setPaymentMethod(method.id)}
              />
              {method.label}
            </label>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
        <button
          onClick={handlePlaceOrder}
          className="w-full py-3 bg-orange-600 text-white rounded-md font-medium"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}

const Field = ({ label, value, onChange, error, type = 'text' }) => (
  <div>
    <label className="text-sm text-gray-600 block mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border rounded-md px-3 py-2 text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
)

export default Checkout