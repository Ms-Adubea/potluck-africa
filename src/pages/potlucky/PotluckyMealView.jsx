import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, Clock, MapPin, Users, ChefHat, Heart, ShoppingCart, 
  Flame, Calendar, User, Mail, CheckCircle, XCircle, AlertCircle, 
  Share2, MessageCircle, ChevronLeft, ChevronRight, Phone
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  apiGetMealById, 
  apiAddFavorite, 
  apiRemoveFavorite,  
} from '../../services/potlucky';
import OrderModal from './OrderModal';
import OrderSuccessModal from './OrderSuccessModal';
import Reviews from './Reviews';

const PotluckyMealView = () => {
  const { mealId } = useParams();
  const navigate = useNavigate();

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const handleBack = () => navigate(-1);

  // Fetch meal details
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const data = await apiGetMealById(mealId);
        setMeal(data);
      } catch (error) {
        console.error('Failed to load meal:', error);
        
        await Swal.fire({
          icon: 'error',
          title: 'Failed to Load Meal',
          text: 'Could not load meal details. Please try again.',
          confirmButtonColor: '#ea580c',
          confirmButtonText: 'Retry'
        }).then((result) => {
          if (result.isConfirmed) {
            fetchMeal();
          } else {
            navigate(-1);
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealId, navigate]);

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
        
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        
        Toast.fire({
          icon: 'success',
          title: 'Removed from favorites'
        });
      } else {
        await apiAddFavorite(meal.id);
        setIsFavorite(true);
        
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        
        Toast.fire({
          icon: 'success',
          title: 'Added to favorites'
        });
      }
    } catch (error) {
      console.error('Failed to update favorite:', error);
      
      await Swal.fire({
        icon: 'error',
        title: 'Action Failed',
        text: 'Could not update favorites. Please try again.',
        confirmButtonColor: '#ea580c',
        timer: 3000
      });
    }
  };

  const handleOrderSuccess = (order, payment) => {
    console.log('Order placed successfully:', order);
    console.log('Payment data:', payment);
    
    setOrderData(order);
    setPaymentData(payment);
    setShowOrderModal(false);
    setShowSuccessModal(true);

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    if (payment && order.payment?.method !== 'cash') {
      Toast.fire({
        icon: 'info',
        title: 'Order placed! Complete payment to confirm.'
      });
    } else {
      Toast.fire({
        icon: 'success',
        title: 'Order placed successfully!'
      });
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    
    Swal.fire({
      title: 'Order Placed!',
      text: 'Would you like to view your orders or continue browsing?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'View Orders',
      cancelButtonText: 'Continue Browsing'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/dashboard/potlucky/orders');
      }
    });
  };

  const handleContactChef = () => {
    if (meal?.createdBy?.phone) {
      window.location.href = `tel:${meal.createdBy.phone}`;
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Contact Unavailable',
        text: 'Chef contact information is not available.',
        confirmButtonColor: '#ea580c',
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

  const isAvailableNow = () => {
    if (!meal) return false;
    const now = new Date();
    const availableFrom = new Date(meal.availableFrom);
    const availableTo = new Date(meal.availableTo);
    return now >= availableFrom && now <= availableTo && meal.status === 'Available';
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: meal.mealName,
          text: `Check out this delicious ${meal.mealName} by ${meal.createdBy?.firstName} ${meal.createdBy?.lastName}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
        
        Toast.fire({
          icon: 'success',
          title: 'Link copied to clipboard!'
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
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

  const currentImage = meal.photos && meal.photos.length > 0 ? meal.photos[activeImageIndex] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm z-20">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
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

      {/* Hero Image with Category Badge */}
      <div className="relative">
        <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
          {currentImage ? (
            <img
              src={currentImage}
              alt={meal.mealName}
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

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
              {meal.category}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white px-6 pt-6 pb-32">
        {/* Title and Description */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-900 flex-1">{meal.mealName}</h1>
            <button
              onClick={toggleFavorite}
              className="ml-2"
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current text-red-600' : 'text-gray-400'}`} />
            </button>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-4">
            {meal.description}
          </p>

          {/* Quick Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{meal.cookingTime} mins</span>
            </div>
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4" />
              <span>{meal.spiceLevel === 'Mild' ? '680' : '800'} calories</span>
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {meal.mainIngredients.map((ingredient, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg capitalize"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Servings</span>
            <span className="font-semibold text-gray-900">{meal.servings}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Cuisine</span>
            <span className="font-semibold text-gray-900">{meal.cuisine}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Spice Level</span>
            <span className="font-semibold text-gray-900">{meal.spiceLevel}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Pickup Location</span>
            <span className="font-semibold text-gray-900 text-right">{meal.pickupLocation}</span>
          </div>
          
          {meal.dietaryRestrictions && meal.dietaryRestrictions.length > 0 && (
            <div className="py-2 border-b border-gray-200">
              <span className="text-gray-600 block mb-2">Dietary Info</span>
              <div className="flex flex-wrap gap-2">
                {meal.dietaryRestrictions.map((restriction, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                  >
                    {restriction}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Sold Count</span>
            <span className="font-semibold text-gray-900">{meal.soldCount} orders</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Availability</span>
            <span className="font-semibold text-gray-900">{meal.availabilityPattern}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Order Cutoff Time</span>
            <span className="font-semibold text-gray-900">{meal.cutoffTime} hours before</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Preparation</span>
            <span className="font-semibold text-gray-900">{meal.preparationFacility}</span>
          </div> */}
          
          {/* <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Food Safety Certified</span>
            <span className={`font-semibold ${meal.foodSafetyCertified ? 'text-green-600' : 'text-gray-500'}`}>
              {meal.foodSafetyCertified ? 'Yes' : 'No'}
            </span>
          </div> */}
          
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Available From</span>
            <span className="font-semibold text-gray-900 text-sm text-right">{formatDate(meal.availableFrom)}</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Available Until</span>
            <span className="font-semibold text-gray-900 text-sm text-right">{formatDate(meal.availableTo)}</span>
          </div>
        </div>

        {/* Chef Information */}
        <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Chef Information</h3>
          <div className="flex items-center space-x-4">
            {meal.createdBy?.avatar ? (
              <img
                src={meal.createdBy.avatar}
                alt={`${meal.createdBy.firstName} ${meal.createdBy.lastName}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/64/f97316/ffffff?text=' + meal.createdBy.firstName.charAt(0);
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center border-2 border-orange-300">
                <User className="w-8 h-8 text-orange-600" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-lg">
                {meal.createdBy?.firstName} {meal.createdBy?.lastName}
              </h4>
              {meal.createdBy?.phone && (
                <button
                  onClick={handleContactChef}
                  className="mt-2 flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>{meal.createdBy.phone}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="text-3xl font-bold text-orange-600">
            ¢{meal.price.toFixed(2)}
          </div>
        </div>

        {/* Order Button */}
        <button
          onClick={() => setShowOrderModal(true)}
          disabled={!isAvailableNow()}
          className={`w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-xl font-semibold text-lg transition-all mb-8 ${
            isAvailableNow()
              ? 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Order Now</span>
        </button>

        {/* Customer Reviews Section */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          
          <Reviews 
            mealId={mealId} 
            canAddReview={true}
            className=""
          />
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        meal={meal}
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        order={orderData}
        payment={paymentData}
      />
    </div>
  );
};

export default PotluckyMealView;