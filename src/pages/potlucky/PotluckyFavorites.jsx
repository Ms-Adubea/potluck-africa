import React, { useState, useEffect } from 'react';
import {
  Heart, Star, MapPin, Clock, DollarSign, 
  ChefHat, AlertCircle, RefreshCw, Search,
  Filter, X, ShoppingCart, ArrowLeft, MoreVertical,
  Zap, Users
} from 'lucide-react';
import { apiGetFavoriteMeals } from '../../services/potlucky';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Transform API data to match component expectations
  const transformFavoriteData = (apiMeal) => {
    const now = new Date();
    const availableFrom = new Date(apiMeal.availableFrom);
    const availableTo = new Date(apiMeal.availableTo);
    
    return {
      id: apiMeal.id,
      name: apiMeal.mealName,
      description: apiMeal.description,
      price: apiMeal.price,
      chef: apiMeal.createdBy?.firstName && apiMeal.createdBy?.lastName 
        ? `${apiMeal.createdBy.firstName} ${apiMeal.createdBy.lastName}`
        : 'Chef',
      location: apiMeal.pickupLocation,
      rating: apiMeal.averageRating || 0,
      reviewCount: apiMeal.reviewCount || 0,
      prepTime: apiMeal.cookingTime,
      servings: apiMeal.servings,
      cuisine: apiMeal.cuisine,
      spiceLevel: apiMeal.spiceLevel,
      category: apiMeal.category,
      isAvailable: apiMeal.status === 'Available' && now >= availableFrom && now <= availableTo,
      image: apiMeal.photos && apiMeal.photos.length > 0 
        ? apiMeal.photos[0] 
        : 'https://nyonyogh.com/wp-content/uploads/2024/01/d19188f6dcc876c7181db2797e951b70-540x440.jpg',
      addedToFavorites: apiMeal.createdAt || new Date().toISOString(),
      availableFrom: apiMeal.availableFrom,
      availableTo: apiMeal.availableTo,
      dietaryRestrictions: apiMeal.dietaryRestrictions || [],
      mainIngredients: apiMeal.mainIngredients || []
    };
  };

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGetFavoriteMeals();
      const transformedData = data.map(transformFavoriteData);
      setFavorites(transformedData);
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
      const result = await toggleFavorite(mealId);
      if (result.success) {
        setFavorites((prev) => prev.filter((meal) => meal.id !== mealId));
        
        // Haptic feedback for PWA
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
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
      // Replace with your cart API
      // await apiAddToCart(meal.id);
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      
      // Show success message (you could use a toast here)
      console.log('Added to cart:', meal.name);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCartId(null);
    }
  };

  const handleViewMeal = (mealId) => {
    navigate(`/dashboard/potlucky/browse/${mealId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvailabilityStatus = (meal) => {
    const now = new Date();
    const availableFrom = new Date(meal.availableFrom);
    const availableTo = new Date(meal.availableTo);
    
    if (now < availableFrom) {
      return { status: 'upcoming', text: `Available from ${formatDate(meal.availableFrom)}`, color: 'text-blue-600 bg-blue-50' };
    } else if (now > availableTo) {
      return { status: 'expired', text: 'No longer available', color: 'text-gray-500 bg-gray-100' };
    } else if (meal.isAvailable) {
      return { status: 'available', text: 'Available now', color: 'text-green-600 bg-green-50' };
    } else {
      return { status: 'unavailable', text: 'Unavailable', color: 'text-red-600 bg-red-50' };
    }
  };

  const filteredAndSortedFavorites = favorites
    .filter((meal) => {
      const matchesSearch = [meal.name, meal.chef, meal.location, meal.cuisine]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesAvailability = !filterAvailable || meal.isAvailable;
      
      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
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
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header - PWA Optimized */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 touch-manipulation"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            <h1 className="text-xl font-bold text-gray-900 flex-1">My Favorites</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {filteredAndSortedFavorites.length}
              </span>
              <button
                onClick={fetchFavorites}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-900 touch-manipulation"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl border-0 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-base"
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full border whitespace-nowrap touch-manipulation ${
                showFilters || filterAvailable
                  ? 'bg-red-50 border-red-200 text-red-700' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              {filterAvailable ? 'Available Only' : 'Filters'}
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-full bg-white text-gray-700 touch-manipulation"
            >
              <option value="recent">Recently Added</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-3 p-4 bg-gray-50 rounded-2xl">
              <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
                <input
                  type="checkbox"
                  checked={filterAvailable}
                  onChange={(e) => setFilterAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-red-500 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Show available meals only</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 flex-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 p-1 -m-1 touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Favorites List */}
        {filteredAndSortedFavorites.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {searchTerm || filterAvailable ? 'No favorites match your criteria' : 'No favorites yet'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed">
              {searchTerm || filterAvailable 
                ? 'Try adjusting your search or filters to find what you\'re looking for'
                : 'Start exploring delicious meals and save your favorites for easy ordering!'
              }
            </p>
            {!searchTerm && !filterAvailable && (
              <button 
                onClick={() => navigate('/dashboard/potlucky/browse')}
                className="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 font-medium touch-manipulation"
              >
                Browse Meals
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedFavorites.map((meal) => {
              const availabilityStatus = getAvailabilityStatus(meal);
              
              return (
                <div 
                  key={meal.id} 
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex">
                    {/* Image */}
                    <div 
                      className="w-28 h-28 flex-shrink-0 cursor-pointer"
                      onClick={() => handleViewMeal(meal.id)}
                    >
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover rounded-l-3xl"
                        onError={(e) => {
                          e.target.src = 'https://nyonyogh.com/wp-content/uploads/2024/01/d19188f6dcc876c7181db2797e951b70-540x440.jpg';
                        }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-4 min-w-0">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 mr-2">
                          <h3 
                            className="font-semibold text-gray-900 text-base leading-tight mb-1 cursor-pointer hover:text-red-600 transition-colors"
                            onClick={() => handleViewMeal(meal.id)}
                          >
                            {meal.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <ChefHat className="w-3 h-3" />
                            <span className="truncate">{meal.chef}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveFromFavorites(meal.id)}
                          disabled={removingId === meal.id}
                          className="text-red-500 hover:text-red-700 p-2 -m-2 touch-manipulation"
                        >
                          {removingId === meal.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                          ) : (
                            <Heart className="w-4 h-4 fill-current" />
                          )}
                        </button>
                      </div>
                      
                      {/* Details Row */}
                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                        {meal.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="font-medium">{meal.rating.toFixed(1)}</span>
                            <span>({meal.reviewCount})</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{meal.prepTime} min</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{meal.servings} serving{meal.servings > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{meal.location}</span>
                      </div>
                      
                      {/* Status and Price Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-gray-900">
                            ¢{meal.price.toFixed(2)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${availabilityStatus.color}`}>
                            {availabilityStatus.text}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleAddToCart(meal)}
                          disabled={!meal.isAvailable || addingToCartId === meal.id}
                          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-2xl font-medium transition-all touch-manipulation ${
                            meal.isAvailable
                              ? 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {addingToCartId === meal.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                          <span className="hidden sm:inline">Add to Cart</span>
                        </button>
                      </div>
                      
                      {/* Added Date */}
                      <div className="mt-2 text-xs text-gray-400">
                        Added {formatDate(meal.addedToFavorites)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PotluckyFavorites;