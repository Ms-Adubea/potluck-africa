import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, Clock, MapPin, Users, ChefHat, Heart, ShoppingCart, 
  Flame, Calendar, User, Mail, CheckCircle, XCircle, AlertCircle, 
  Share2, MessageCircle, Plus, Minus, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  apiGetMealById, 
  apiAddFavorite, 
  apiRemoveFavorite, 
  apiCheckFavoriteStatus 
} from '../../services/potlucky';

const PotluckyMealView = () => {
  const { mealId } = useParams();
  const navigate = useNavigate();

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleBack = () => navigate(-1);

  // Fetch meal details
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const data = await apiGetMealById(mealId);
        setMeal(data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load meal details.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealId]);

  // Check favorite status
  useEffect(() => {
    const checkFavorite = async () => {
      if (!mealId) return;
      try {
        const status = await apiCheckFavoriteStatus([mealId]);
        setIsFavorite(status[mealId] || false);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavorite();
  }, [mealId]);

  // Reset active image when meal changes
  useEffect(() => {
    if (meal?.photos?.length > 0) {
      setActiveImageIndex(0);
    }
  }, [meal]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await apiRemoveFavorite(meal.id);
        setIsFavorite(false);
        Swal.fire({
          icon: 'success',
          title: 'Removed from Favorites',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await apiAddFavorite(meal.id);
        setIsFavorite(true);
        Swal.fire({
          icon: 'success',
          title: 'Added to Favorites',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update favorite status.',
      });
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-green-700 bg-green-100';
      case 'Pending':
        return 'text-amber-700 bg-amber-100';
      case 'Unavailable':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="w-3 h-3" />;
      case 'Pending':
        return <AlertCircle className="w-3 h-3" />;
      case 'Unavailable':
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getSpiceLevelInfo = (level) => {
    switch (level) {
      case 'Mild':
        return { color: 'text-green-700', bg: 'bg-green-100', flames: 1 };
      case 'Medium':
        return { color: 'text-orange-700', bg: 'bg-orange-100', flames: 2 };
      case 'Hot':
        return { color: 'text-red-700', bg: 'bg-red-100', flames: 3 };
      default:
        return { color: 'text-gray-700', bg: 'bg-gray-100', flames: 0 };
    }
  };

  const isAvailableNow = () => {
    if (!meal) return false;
    const now = new Date();
    const availableFrom = new Date(meal.availableFrom);
    const availableTo = new Date(meal.availableTo);
    return now >= availableFrom && now <= availableTo && meal.status === 'Available';
  };

  const nextImage = () => {
    if (meal?.photos?.length > 1) {
      setActiveImageIndex((prev) => (prev + 1) % meal.photos.length);
    }
  };

  const prevImage = () => {
    if (meal?.photos?.length > 1) {
      setActiveImageIndex((prev) => (prev - 1 + meal.photos.length) % meal.photos.length);
    }
  };

  const goToImage = (index) => {
    if (meal?.photos && index >= 0 && index < meal.photos.length) {
      setActiveImageIndex(index);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meal details...</p>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center p-6">
          <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Meal not found</h3>
          <p className="text-gray-600 mb-6">This meal might have been removed or doesn't exist.</p>
          <button
            onClick={handleBack}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const spiceInfo = getSpiceLevelInfo(meal.spiceLevel);
  const hasMultipleImages = meal.photos && meal.photos.length > 1;
  const currentImage = meal.photos && meal.photos.length > 0 ? meal.photos[activeImageIndex] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center space-x-2">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={toggleFavorite}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                isFavorite
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Carousel */}
      <div className="relative">
        <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
          {currentImage ? (
            <img
              src={currentImage}
              alt={`${meal.mealName} - Image ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x450/f3f4f6/9ca3af?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
              <ChefHat className="w-20 h-20 text-orange-400" />
            </div>
          )}

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
        
        {/* Image Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2">
              {meal.photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeImageIndex === index ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="absolute top-4 left-4">
            <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              {activeImageIndex + 1} / {meal.photos.length}
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${getStatusColor(meal.status)}`}>
            {getStatusIcon(meal.status)}
            <span>{meal.status}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 px-6 pt-8 pb-32">
        {/* Title and Basic Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{meal.mealName}</h1>
          
          {/* Rating and Reviews */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-amber-400 fill-current" />
              <span className="font-semibold text-gray-900">{meal.averageRating || 'New'}</span>
              <span className="text-gray-500 text-sm">({meal.reviewCount} reviews)</span>
            </div>
            <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-sm font-medium">
              <MessageCircle className="w-4 h-4" />
              <span>See reviews</span>
            </button>
          </div>

          {/* Description */}
          <div className="text-gray-600 leading-relaxed">
            <p className={`${!showFullDescription && meal.description.length > 150 ? 'line-clamp-3' : ''}`}>
              {meal.description}
            </p>
            {meal.description.length > 150 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-2"
              >
                {showFullDescription ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Cooking Time</span>
            </div>
            <span className="font-semibold text-gray-900">{meal.cookingTime} mins</span>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Servings</span>
            </div>
            <span className="font-semibold text-gray-900">{meal.servings}</span>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Flame className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Spice Level</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-gray-900">{meal.spiceLevel}</span>
              <div className="flex">
                {[...Array(3)].map((_, i) => (
                  <Flame
                    key={i}
                    className={`w-3 h-3 ${i < spiceInfo.flames ? spiceInfo.color : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Pickup</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm">{meal.pickupLocation}</span>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-blue-900">Availability Window</span>
          </div>
          <div className="text-sm text-blue-800 space-y-1">
            <div>From: {formatDate(meal.availableFrom)}</div>
            <div>Until: {formatDate(meal.availableTo)}</div>
            <div className={`font-semibold flex items-center space-x-1 mt-2 ${isAvailableNow() ? 'text-green-600' : 'text-red-600'}`}>
              {isAvailableNow() ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Available for order now</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Not currently available</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Main Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {meal.mainIngredients.map((ingredient, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-full"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>

        {/* Dietary Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Dietary Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Category</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{meal.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Cuisine</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">{meal.cuisine}</span>
            </div>
            {meal.dietaryRestrictions && meal.dietaryRestrictions.length > 0 && (
              <div>
                <span className="text-gray-600 block mb-2">Dietary Restrictions</span>
                <div className="flex flex-wrap gap-2">
                  {meal.dietaryRestrictions.map((restriction, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full"
                    >
                      {restriction}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chef Information */}
        <div className="border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChefHat className="w-5 h-5 mr-2" />
            Chef Information
          </h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {meal.createdBy.firstName} {meal.createdBy.lastName}
              </h4>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <Mail className="w-4 h-4" />
                <span>{meal.createdBy.email}</span>
              </div>
            </div>
            <button className="text-orange-600 hover:text-orange-700">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
        <div className="max-w-md mx-auto">
          {/* Price and Quantity */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">¢{meal.price * quantity}</div>
              <div className="text-sm text-gray-500">¢{meal.price} per serving</div>
            </div>
            
            <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="font-semibold text-lg min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Order Button */}
          <button
            disabled={!isAvailableNow()}
            className={`w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-xl font-semibold text-lg transition-all ${
              isAvailableNow()
                ? 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{isAvailableNow() ? 'ORDER NOW' : 'CURRENTLY UNAVAILABLE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PotluckyMealView;