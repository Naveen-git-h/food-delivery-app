import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { restaurants, categories } from '../data/restaurants'

const Home = () => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const featuredRestaurants = restaurants.slice(0, 6)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/restaurants?q=${encodeURIComponent(search)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Location bar */}
      <div className="px-4 py-2 flex items-center gap-1 text-sm text-gray-600 bg-white border-b">
        <span>📍</span>
        <span>Hyderabad</span>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="px-4 py-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for restaurants or food..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </form>

      {/* Categories */}
      <section className="px-4 py-2">
        <h2 className="text-lg font-semibold mb-3">Categories</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/restaurants?category=${cat.name}`)}
              className="flex flex-col items-center gap-1 min-w-17.5 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured restaurants */}
      <section className="px-4 py-4">
        <h2 className="text-lg font-semibold mb-3">Popular Restaurants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredRestaurants.map((r) => (
            <div
              key={r.id}
              onClick={() => navigate(`/restaurants/${r.id}`)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
            >
              <img
                src={r.image}
                alt={r.name}
                className="w-full h-36 object-cover"
              />
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{r.name}</h3>
                  <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    ★ {r.rating}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {r.cuisine.join(', ')}
                </p>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{r.deliveryTime}</span>
                  <span>{r.distance}</span>
                </div>
                {r.offer && (
                  <p className="text-xs text-orange-600 font-medium mt-2">
                    {r.offer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home