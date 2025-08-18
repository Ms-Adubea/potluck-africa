import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Eye,
  EyeOff,
  Star,
  MapPin,
  Clock,
  ChefHat,
  Users,
  Calendar,
  Trash2,
  Loader2,
  AlertCircle,
  Share2,
  Heart,
  DollarSign,
  Utensils,
  Timer,
  Award,
  TrendingUp,
} from "lucide-react";

// const MealDetailView = ({
//   meal,
//   onBack,
//   onEdit,
//   onToggleAvailability,
//   onDelete,
//   updating,
//   onMealUpdate, // New prop to handle meal updates
// }) => {
//   const [currentMeal, setCurrentMeal] = useState(meal);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [isImageLoaded, setIsImageLoaded] = useState(false);

//   // Update local state when meal prop changes
//   useEffect(() => {
//     setCurrentMeal(meal);
//   }, [meal]);

const MealDetailView = ({
  meal,
  onBack,
  onEdit,
  onToggleAvailability,
  onDelete,
  updating,
  onMealUpdate, // Make sure this prop is passed from MyMeals
}) => {
  const [currentMeal, setCurrentMeal] = useState(meal);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Update local state when meal prop changes
  useEffect(() => {
    setCurrentMeal(meal);
  }, [meal]);

  // SweetAlert2 CDN (you can also install via npm)
  useEffect(() => {
    if (!window.Swal) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
      document.head.appendChild(script);
    }
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showLoadingAlert = () => {
    if (window.Swal) {
      window.Swal.fire({
        title: 'Cooking up changes...',
        html: `
          <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4"></div>
            <div class="text-orange-600 font-medium">Your meal is being updated</div>
          </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        customClass: {
          popup: 'rounded-2xl',
        }
      });
    }
  };

  const showSuccessAlert = (message) => {
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        confirmButtonColor: '#f97316',
        customClass: {
          popup: 'rounded-2xl',
        }
      });
    }
  };

  const showErrorAlert = (message) => {
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: message,
        confirmButtonColor: '#f97316',
        customClass: {
          popup: 'rounded-2xl',
        }
      });
    }
  };

  const handleToggleAvailability = async () => {
    showLoadingAlert();
    try {
      const result = await onToggleAvailability(currentMeal.id, currentMeal.status);
      if (result && result.success) {
        // Update local state
        const newStatus = currentMeal.status === "Available" ? "Unavailable" : "Available";
        const updatedMeal = { ...currentMeal, status: newStatus };
        setCurrentMeal(updatedMeal);
        
        // Notify parent component
        if (onMealUpdate) {
          onMealUpdate(updatedMeal);
        }
        
        if (window.Swal) {
          window.Swal.close();
        }
        showSuccessAlert(`Meal is now ${newStatus.toLowerCase()}`);
      } else {
        if (window.Swal) {
          window.Swal.close();
        }
        showErrorAlert('Failed to update meal status');
      }
    } catch (error) {
      if (window.Swal) {
        window.Swal.close();
      }
      showErrorAlert('Something went wrong. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.Swal) {
      const result = await window.Swal.fire({
        title: 'Delete this meal?',
        text: `"${currentMeal.mealName}" will be permanently removed`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        customClass: {
          popup: 'rounded-2xl',
        }
      });

      if (result.isConfirmed) {
        showLoadingAlert();
        try {
          await onDelete(currentMeal.id);
          if (window.Swal) {
            window.Swal.close();
          }
          showSuccessAlert('Meal deleted successfully');
          onBack();
        } catch (error) {
          if (window.Swal) {
            window.Swal.close();
          }
          showErrorAlert('Failed to delete meal');
        }
      }
    }
  };

  const handleEdit = () => {
    onEdit(currentMeal);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentMeal.mealName,
        text: currentMeal.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccessAlert('Link copied to clipboard!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "Pending":
        return "bg-gradient-to-r from-yellow-500 to-amber-500 text-white";
      default:
        return "bg-gradient-to-r from-red-500 to-rose-500 text-white";
    }
  };

  const getSpiceLevelColor = (level) => {
    switch (level) {
      case "Hot":
      case "Very Hot":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "Medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      default:
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-orange-100 shadow-lg z-20">
        <div className="px-4 py-4 flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="p-3 hover:bg-orange-100 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="flex items-center space-x-2">
            <ChefHat className="w-6 h-6 text-orange-600" />
            <h1 className="font-bold text-lg text-gray-800">Meal Details</h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-3 hover:bg-blue-100 rounded-full transition-all duration-300 hover:scale-110"
            >
              <Share2 className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={handleEdit}
              className="p-3 hover:bg-orange-100 rounded-full transition-all duration-300 hover:scale-110"
              disabled={updating}
            >
              <Edit className="w-5 h-5 text-orange-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-3 hover:bg-red-100 rounded-full transition-all duration-300 hover:scale-110"
              disabled={updating}
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={currentMeal.photos?.[0] || "/api/placeholder/800/400"}
            alt={currentMeal.mealName || "Meal"}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isImageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>
        
        {/* Floating Action Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleToggleAvailability}
            className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
              currentMeal.status === "Available" 
                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" 
                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
            } text-white`}
            disabled={updating}
          >
            {updating ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : currentMeal.status === "Available" ? (
              <Eye className="w-6 h-6" />
            ) : (
              <EyeOff className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4">
          <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getStatusColor(currentMeal.status)}`}>
            {currentMeal.status === "Available"
              ? "🟢 Available"
              : currentMeal.status === "Pending"
              ? "🟡 Pending"
              : "🔴 Unavailable"}
          </span>
        </div>

        {/* Photo Count Indicator */}
        {currentMeal.photos && currentMeal.photos.length > 1 && (
          <div className="absolute bottom-4 right-4">
            <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              📸 {currentMeal.photos.length} photos
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8 max-w-4xl mx-auto">
        {/* Header Info Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {currentMeal.mealName || "Unnamed Meal"}
          </h2>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ¢{currentMeal.price || "0.00"}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {currentMeal.category || "Uncategorized"}
              </span>
              {currentMeal.cuisine && (
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  {currentMeal.cuisine}
                </span>
              )}
            </div>
          </div>
          
          <p className="text-gray-700 text-lg leading-relaxed">
            {currentMeal.description || "No description provided"}
          </p>

          {/* Rating Section (Placeholder for future) */}
          <div className="flex items-center mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="ml-2 text-gray-700 font-medium">
              {currentMeal.averageRating || 0} ({currentMeal.reviewCount || 0} reviews)
            </span>
            <div className="ml-auto">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <Clock className="w-8 h-8" />
              <Timer className="w-6 h-6 opacity-70" />
            </div>
            <p className="text-blue-100 text-sm mt-2">Cook Time</p>
            <p className="font-bold text-lg">
              {currentMeal.cookingTime ? `${currentMeal.cookingTime}m` : "N/A"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8" />
              <Utensils className="w-6 h-6 opacity-70" />
            </div>
            <p className="text-purple-100 text-sm mt-2">Servings</p>
            <p className="font-bold text-lg">{currentMeal.servings || 1}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <MapPin className="w-8 h-8" />
              <Award className="w-6 h-6 opacity-70" />
            </div>
            <p className="text-green-100 text-sm mt-2">Location</p>
            <p className="font-bold text-sm truncate">
              {currentMeal.pickupLocation || "Not set"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <ChefHat className="w-8 h-8" />
              <Heart className="w-6 h-6 opacity-70" />
            </div>
            <p className="text-orange-100 text-sm mt-2">Status</p>
            <p className="font-bold text-sm">{currentMeal.status}</p>
          </div>
        </div>

        {/* Availability Schedule */}
        {(currentMeal.availableFrom || currentMeal.availableTo) && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-indigo-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-800">Availability Schedule</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {currentMeal.availableFrom && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-l-4 border-green-500">
                  <p className="text-green-700 font-semibold mb-1">Available From</p>
                  <p className="text-green-800 font-bold">
                    {formatDateTime(currentMeal.availableFrom)}
                  </p>
                </div>
              )}
              {currentMeal.availableTo && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border-l-4 border-red-500">
                  <p className="text-red-700 font-semibold mb-1">Available Until</p>
                  <p className="text-red-800 font-bold">
                    {formatDateTime(currentMeal.availableTo)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ingredients */}
        {currentMeal.mainIngredients && currentMeal.mainIngredients.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Utensils className="w-6 h-6 text-orange-600 mr-2" />
              Main Ingredients
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentMeal.mainIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3"></div>
                  <span className="text-gray-800 font-medium">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dietary Restrictions */}
        {currentMeal.dietaryRestrictions && currentMeal.dietaryRestrictions.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Award className="w-6 h-6 text-green-600 mr-2" />
              Dietary Information
            </h3>
            <div className="flex flex-wrap gap-3">
              {currentMeal.dietaryRestrictions.map((restriction, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  ✓ {restriction}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Spice Level */}
        {currentMeal.spiceLevel && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Spice Level</h3>
            <div className="inline-block">
              <span className={`px-6 py-3 rounded-full text-lg font-bold shadow-lg ${getSpiceLevelColor(currentMeal.spiceLevel)}`}>
                🌶️ {currentMeal.spiceLevel}
              </span>
            </div>
          </div>
        )}

        {/* Created Date */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2" />
            <span className="font-medium">Created on {formatDate(currentMeal.createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleEdit}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
            disabled={updating}
          >
            <Edit className="w-5 h-5 inline mr-2" />
            Edit Meal
          </button>
          <button
            onClick={handleToggleAvailability}
            className={`p-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 ${
              currentMeal.status === "Available"
                ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            }`}
            disabled={updating}
          >
            {updating ? (
              <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
            ) : currentMeal.status === "Available" ? (
              <EyeOff className="w-5 h-5 inline mr-2" />
            ) : (
              <Eye className="w-5 h-5 inline mr-2" />
            )}
            {currentMeal.status === "Available" ? "Make Unavailable" : "Make Available"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealDetailView;