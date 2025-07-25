import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  MapPin, 
  Users, 
  ChefHat, 
  Heart, 
  ShoppingCart, 
  Flame,
  Calendar,
  User,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Share2,
  MessageCircle
} from 'lucide-react';
import { apiGetMealById } from '../../services/potlucky';
import { useNavigate, useParams } from 'react-router-dom';



const PotluckyMealView = () => {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { mealId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await apiGetMealById(mealId);
        setMeal(response);
      } catch (error) {
        console.error('Failed to fetch meal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Unavailable':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'Unavailable':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSpiceLevelColor = (level) => {
    switch (level) {
      case 'Mild':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Hot':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const isAvailableNow = () => {
    const now = new Date();
    const availableFrom = new Date(meal.availableFrom);
    const availableTo = new Date(meal.availableTo);
    return now >= availableFrom && now <= availableTo && meal.status === 'Available';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Meal not found</h3>
        <button
          onClick={onBack}
          className="text-orange-600 hover:text-orange-700"
        >
          Go back to browse
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Browse</span>
        </button>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            {meal.photos && meal.photos.length > 0 ? (
              <img
                src={meal.photos[activeImageIndex]}
                alt={meal.mealName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ChefHat className="w-16 h-16" />
              </div>
            )}
          </div>
          
          {/* Image Thumbnails */}
          {meal.photos && meal.photos.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {meal.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImageIndex === index
                      ? 'border-orange-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`${meal.mealName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Title and Status */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{meal.mealName}</h1>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(meal.status)}`}>
                {getStatusIcon(meal.status)}
                <span>{meal.status}</span>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{meal.description}</p>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-medium">{meal.averageRating || 'New'}</span>
              <span className="text-gray-500">({meal.reviewCount} reviews)</span>
            </div>
            <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-sm">
              <MessageCircle className="w-4 h-4" />
              <span>View Reviews</span>
            </button>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-green-600">¢{meal.price}</span>
            <span className="text-gray-500">per serving</span>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Servings</div>
                <div className="font-medium">{meal.servings}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Cooking Time</div>
                <div className="font-medium">{meal.cookingTime} mins</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Pickup Location</div>
                <div className="font-medium">{meal.pickupLocation}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Spice Level</div>
                <div className={`font-medium px-2 py-1 rounded text-xs ${getSpiceLevelColor(meal.spiceLevel)}`}>
                  {meal.spiceLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Availability Window */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Availability Window
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div>From: {formatDate(meal.availableFrom)}</div>
              <div>Until: {formatDate(meal.availableTo)}</div>
              <div className={`font-medium ${isAvailableNow() ? 'text-green-600' : 'text-red-600'}`}>
                {isAvailableNow() ? '✓ Available for order now' : '✗ Not currently available'}
              </div>
            </div>
          </div>

          {/* Order Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Quantity</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-green-600">¢{meal.price * quantity}</span>
            </div>
            <button
              disabled={!isAvailableNow()}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                isAvailableNow()
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{isAvailableNow() ? 'Add to Cart' : 'Currently Unavailable'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingredients */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {meal.mainIngredients.map((ingredient, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>

        {/* Dietary Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dietary Information</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Category:</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">{meal.category}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Cuisine:</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">{meal.cuisine}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {meal.dietaryRestrictions.map((restriction, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded"
                >
                  {restriction}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chef Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ChefHat className="w-5 h-5 mr-2" />
          Chef Information
        </h3>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-orange-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">
              {meal.createdBy.firstName} {meal.createdBy.lastName}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
              <Mail className="w-4 h-4" />
              <span>{meal.createdBy.email}</span>
            </div>
            <div className="flex items-center space-x-4 mt-3">
              <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                View Chef Profile
              </button>
              <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                Message Chef
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Meal Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Meal ID:</span>
            <div className="font-mono text-xs text-gray-700">{meal.id}</div>
          </div>
          <div>
            <span className="text-gray-500">Created:</span>
            <div className="text-gray-700">{formatDate(meal.createdAt)}</div>
          </div>
          <div>
            <span className="text-gray-500">Last Updated:</span>
            <div className="text-gray-700">{formatDate(meal.updatedAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotluckyMealView;