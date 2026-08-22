import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { restaurants, categories } from '../data/restaurants'
import Skeleton from '../components/common/Skeleton'
import { useFavorites } from '../context/FavoritesContext'

const Restaurants = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
   const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') || '')
  const [cuisineFilter, setCuisineFilter] = useState(searchParams.get('category') || 'All')
  const [sortBy, setSortBy] = useState('default')
  const [loading, setLoading] = useState(true)
  const { isFavorite, toggleFavorite } = useFavorites()


   useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    let result = [...restaurants]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q))
      )
    }

    if (cuisineFilter !== 'All') {
      result = result.filter((r) => r.cuisine.includes(cuisineFilter))
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'deliveryTime') {
      result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime))
    } else if (sortBy === 'priceLow') {
      result.sort((a, b) => a.avgPrice - b.avgPrice)
    }

    return result
  }, [debouncedSearch, cuisineFilter, sortBy])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4">
      <h1 className="text-xl font-bold mb-4">Restaurants</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search restaurants or cuisine..."
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
      />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        <button
          onClick={() => setCuisineFilter('All')}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
            cuisineFilter === 'All' ? 'bg-orange-600 text-white' : 'bg-white border border-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCuisineFilter(cat.name)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              cuisineFilter === cat.name ? 'bg-orange-600 text-white' : 'bg-white border border-gray-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="mb-4 px-3 py-2 rounded-lg border border-gray-300 text-sm"
      >
        <option value="default">Sort: Relevance</option>
        <option value="rating">Rating: High to Low</option>
        <option value="deliveryTime">Delivery Time</option>
        <option value="priceLow">Price: Low to High</option>
      </select>

      {loading ? (
        <Skeleton count={6} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">No restaurants found</p>
          <p className="text-sm mt-1">Try a different search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(r.id)
                }}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-lg"
              >
                {isFavorite(r.id) ? '❤️' : '🤍'}
              </button>
              <div onClick={() => navigate(`/restaurants/${r.id}`)} className="cursor-pointer">
                <img src={r.image} alt={r.name} className="w-full h-36 object-cover" />
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{r.name}</h3>
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      ★ {r.rating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{r.cuisine.join(', ')}</p>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{r.deliveryTime}</span>
                    <span>{r.distance}</span>
                  </div>
                  {r.offer && (
                    <p className="text-xs text-orange-600 font-medium mt-2">{r.offer}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Restaurants