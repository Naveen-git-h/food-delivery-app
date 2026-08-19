import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const STATUSES = [
  { key: 'confirmed', label: 'Order Confirmed' },
  { key: 'preparing', label: 'Restaurant Preparing' },
  { key: 'outForDelivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
]

const TrackOrder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (stepIndex >= STATUSES.length - 1) return
    const timer = setTimeout(() => {
      setStepIndex((prev) => prev + 1)
    }, 4000)
    return () => clearTimeout(timer)
  }, [stepIndex])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-xl font-bold mb-1">Track Order</h1>
      <p className="text-sm text-gray-500 mb-6">Order #{id}</p>

      <div className="bg-white rounded-lg shadow-sm p-5">
        {STATUSES.map((status, index) => {
          const isDone = index < stepIndex
          const isCurrent = index === stepIndex
          return (
            <div key={status.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-orange-500 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isDone ? '✓' : isCurrent ? '●' : '○'}
                </div>
                {index < STATUSES.length - 1 && (
                  <div className={`w-0.5 h-10 ${isDone ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="pb-8">
                <p className={`font-medium ${isDone || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                  {status.label}
                </p>
                {isCurrent && index < STATUSES.length - 1 && (
                  <p className="text-xs text-gray-500 mt-0.5">In progress...</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {stepIndex === STATUSES.length - 1 && (
        <div className="text-center mt-4">
          <p className="text-green-600 font-medium mb-3">🎉 Your order has been delivered!</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-orange-600 text-white rounded-md"
          >
            View Order History
          </button>
        </div>
      )}
    </div>
  )
}

export default TrackOrder