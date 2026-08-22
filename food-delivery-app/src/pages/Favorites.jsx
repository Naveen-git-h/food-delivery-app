import { useNavigate } from 'react-router-dom'
import { restaurants } from '../data/restaurants'
import { useFavorites } from '../context/FavoritesContext'

const Favorites = () => {
  const navigate = useNavigate()
  const { favoriteIds, toggleFavorite } = useFavorites()

  const favoriteRestaurants = restaurants.filter((restaurant) =>
    favoriteIds.includes(restaurant.id)
  )

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

      {favoriteRestaurants.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            You haven't added any favorites yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteRestaurants.map((r) => (
            <div
              key={r.id}
              className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Favorite button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(r.id)
                }}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-lg"
              >
                ❤️
              </button>

              <div
                onClick={() => navigate(`/restaurants/${r.id}`)}
                className="cursor-pointer"
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites