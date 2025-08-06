import React, { useState, useEffect } from 'react';
import {
  Heart, Star, MapPin, Clock, DollarSign, 
  ChefHat, AlertCircle, RefreshCw, Search,
  Filter, X, ShoppingCart
} from 'lucide-react';
import { apiGetFavoriteMeals } from '../../services/potlucky'; // Use real import

// Keep or replace these with real API implementations
const apiRemoveFromFavorites = async (mealId) => {
  try {
    const res = await apiClient.delete(`/meals/${mealId}/favorites`);
    return res.data;
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    throw error;
  }
};

const apiAddToCart = async (mealId, quantity = 1) => {
  try {
    const res = await apiClient.post('/cart', { mealId, quantity });
    return res.data;
  } catch (error) {
    console.error('Failed to add to cart:', error);
    throw error;
  }
};

const PotluckyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [addingToCartId, setAddingToCartId] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGetFavoriteMeals();
      setFavorites(data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (mealId) => {
    try {
      setRemovingId(mealId);
      await apiRemoveFromFavorites(mealId);
      setFavorites((prev) => prev.filter((meal) => meal.id !== mealId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Failed to remove from favorites. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (meal) => {
    if (!meal.isAvailable) return;

    try {
      setAddingToCartId(meal.id);
      await apiAddToCart(meal.id);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCartId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

 const filteredAndSortedFavorites = favorites
  .filter((meal) => {
    const name = meal?.name || '';
    const chef = meal?.chef || '';
    const location = meal?.location || '';

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAvailability = !filterAvailable || meal.isAvailable;

    return matchesSearch && matchesAvailability;
  })

    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'recent':
        default:
          return new Date(b.addedToFavorites) - new Date(a.addedToFavorites);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-red-500 fill-current" />
          <h1 className="text-xl font-bold text-gray-900">My Favorites</h1>
          <span className="ml-auto text-sm text-gray-500">
            ({filteredAndSortedFavorites.length})
          </span>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border ${
              showFilters ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700"
          >
            <option value="recent">Recently Added</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <button
            onClick={fetchFavorites}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.checked)}
                className="rounded text-red-500 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Available only</span>
            </label>
          </div>
        )}
      </div>

      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Favorites List */}
        {filteredAndSortedFavorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterAvailable ? 'No favorites match your criteria' : 'No favorites yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterAvailable 
                ? 'Try adjusting your search or filters'
                : 'Start exploring meals and add your favorites!'
              }
            </p>
            {!searchTerm && !filterAvailable && (
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Browse Meals
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedFavorites.map((meal) => (
              <div key={meal.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex">
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-3 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                        {meal.name}
                      </h3>
                      <button
                        onClick={() => handleRemoveFromFavorites(meal.id)}
                        disabled={removingId === meal.id}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        {removingId === meal.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <Heart className="w-4 h-4 fill-current" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <ChefHat className="w-3 h-3" />
                      <span>{meal.chef}</span>
                      <MapPin className="w-3 h-3 ml-1" />
                      <span className="truncate">{meal.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{meal.rating}</span>
                        <span>({meal.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{meal.prepTime} min</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-600">
                          ₵{meal.price.toFixed(2)}
                        </span>
                        {!meal.isAvailable && (
                          <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            Unavailable
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(meal)}
                        disabled={!meal.isAvailable || addingToCartId === meal.id}
                        className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg transition-colors ${
                          meal.isAvailable
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {addingToCartId === meal.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <ShoppingCart className="w-3 h-3" />
                        )}
                        Add to Cart
                      </button>
                    </div>
                    
                    <div className="mt-1 text-xs text-gray-500">
                      Added {formatDate(meal.addedToFavorites)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PotluckyFavorites;