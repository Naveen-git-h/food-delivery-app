import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { restaurants } from '../data/restaurants'
import { menuItems } from '../data/menuItems'
import { useCart } from '../context/CartContext'

const RestaurantDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { items, addItem, clearCart } = useCart()
  const [selectedItem, setSelectedItem] = useState(null)
  const [pendingItem, setPendingItem] = useState(null)
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false)

  const restaurant = restaurants.find((r) => r.id === parseInt(id))
  const items_for_restaurant = menuItems.filter((m) => m.restaurantId === parseInt(id))

  if (!restaurant) {
    return <div className="p-4">Restaurant not found</div>
  }

  const groupedByCategory = items_for_restaurant.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const buildCartItem = (menuItem, size, addonIds, instructions) => {
    const basePrice = size ? size.price : menuItem.basePrice
    const addonsTotal = (addonIds || []).reduce((sum, aId) => {
      const addon = menuItem.addons?.find((a) => a.id === aId)
      return sum + (addon ? addon.price : 0)
    }, 0)
    return {
      id: `${menuItem.id}-${Date.now()}`,
      menuItemId: menuItem.id,
      restaurantId: restaurant.id,
      name: menuItem.name,
      size: size?.label || null,
      addons: (addonIds || []).map((aId) => menuItem.addons.find((a) => a.id === aId)?.label),
      instructions: instructions || '',
      price: basePrice + addonsTotal,
      quantity: 1,
    }
  }

  const handleAddClick = (menuItem) => {
    if (menuItem.customizable) {
      setSelectedItem(menuItem)
      return
    }
    tryAdd(buildCartItem(menuItem, null, [], ''))
  }

  const tryAdd = (cartItem) => {
    if (items.length > 0 && items[0].restaurantId !== restaurant.id) {
      setPendingItem(cartItem)
      setShowSwitchConfirm(true)
      return
    }
    addItem(cartItem)
  }

  const confirmSwitch = () => {
    clearCart()
    if (pendingItem) addItem(pendingItem)
    setPendingItem(null)
    setShowSwitchConfirm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />

      <div className="px-4 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold">{restaurant.name}</h1>
        <p className="text-sm text-gray-500">{restaurant.cuisine.join(', ')}</p>
        <div className="flex gap-4 text-sm text-gray-600 mt-2">
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">★ {restaurant.rating}</span>
          <span>{restaurant.deliveryTime}</span>
          <span>{restaurant.priceRange}</span>
        </div>
        {restaurant.offer && (
          <p className="text-sm text-orange-600 font-medium mt-2">{restaurant.offer}</p>
        )}
      </div>

      <div className="px-4 py-4">
        {Object.entries(groupedByCategory).map(([category, catItems]) => (
          <div key={category} className="mb-6">
            <h2 className="text-lg font-semibold mb-3">{category}</h2>
            <div className="space-y-3">
              {catItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-3 flex gap-3">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className={`w-3 h-3 border ${item.isVeg ? 'border-green-600' : 'border-red-600'} inline-block rounded-sm`}>
                        <span className={`block w-1.5 h-1.5 m-auto mt-0.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      </span>
                      {item.isBestseller && (
                        <span className="text-xs text-orange-600 font-medium">Bestseller</span>
                      )}
                    </div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-semibold">₹{item.basePrice}</span>
                      <button
                        onClick={() => handleAddClick(item)}
                        className="px-3 py-1 bg-orange-600 text-white text-sm rounded-md"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div
          onClick={() => navigate('/cart')}
          className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white px-4 py-3 flex justify-between items-center cursor-pointer"
        >
          <span>{items.length} item(s) in cart</span>
          <span className="font-semibold">View Cart →</span>
        </div>
      )}

      {selectedItem && (
        <CustomizeModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={(size, addonIds, instructions) => {
            tryAdd(buildCartItem(selectedItem, size, addonIds, instructions))
            setSelectedItem(null)
          }}
        />
      )}

      {showSwitchConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full">
            <p className="mb-4">
              Your cart contains items from another restaurant. Would you like to clear the existing cart?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowSwitchConfirm(false); setPendingItem(null) }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitch}
                className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-md"
              >
                Clear Cart & Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CustomizeModal = ({ item, onClose, onConfirm }) => {
  const [size, setSize] = useState(item.sizes ? item.sizes[0] : null)
  const [addonIds, setAddonIds] = useState([])
  const [instructions, setInstructions] = useState('')

  const toggleAddon = (id) => {
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

  const total = (size ? size.price : item.basePrice) +
    addonIds.reduce((sum, aId) => sum + (item.addons.find((a) => a.id === aId)?.price || 0), 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-lg sm:rounded-lg p-4 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-3">{item.name}</h2>

        {item.sizes && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Size</h3>
            {item.sizes.map((s) => (
              <label key={s.id} className="flex items-center justify-between py-1.5">
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={size?.id === s.id}
                    onChange={() => setSize(s)}
                  />
                  {s.label}
                </span>
                <span>₹{s.price}</span>
              </label>
            ))}
          </div>
        )}

        {item.addons && item.addons.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Add-ons</h3>
            {item.addons.map((a) => (
              <label key={a.id} className="flex items-center justify-between py-1.5">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addonIds.includes(a.id)}
                    onChange={() => toggleAddon(a.id)}
                  />
                  {a.label}
                </span>
                <span>+₹{a.price}</span>
              </label>
            ))}
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-medium mb-2">Special Instructions</h3>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="E.g. less spicy, no onions..."
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            rows={2}
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-3 py-2 border border-gray-300 rounded-md">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(size, addonIds, instructions)}
            className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-md"
          >
            Add — ₹{total}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetails