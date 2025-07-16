import React, { useState } from "react";
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
} from "lucide-react";

const MealDetailView = ({
  meal,
  onBack,
  onEdit,
  onToggleAvailability,
  onDelete,
  updating,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDelete = () => {
    onDelete(meal.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-lg">Meal Details</h1>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(meal)}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={updating}
          >
            <Edit className="w-5 h-5 text-orange-600" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={updating}
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={meal.photos?.[0] || "/api/placeholder/400/300"}
          alt={meal.mealName || "Meal"}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onToggleAvailability(meal.id)}
            className={`p-3 rounded-full ${
              meal.status === "available" ? "bg-green-500" : "bg-gray-500"
            } text-white shadow-lg`}
            disabled={updating}
          >
            {updating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : meal.status === "available" ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              meal.status === "available"
                ? "bg-green-100 text-green-800"
                : meal.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {meal.status === "available"
              ? "Available"
              : meal.status === "Pending"
              ? "Pending"
              : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {meal.mealName || "Unnamed Meal"}
          </h2>
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-orange-600">
              ¢{meal.price || "0.00"}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {meal.category || "Uncategorized"}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {meal.description || "No description provided"}
          </p>
        </div>

        {/* Location & Cuisine */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {meal.pickupLocation || "Location not set"}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {meal.cuisine || "Cuisine not specified"}
          </div>
        </div>

        {/* Time & Servings */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-gray-500">Cook Time</p>
            <p className="font-semibold">
              {meal.cookingTime ? `${meal.cookingTime} mins` : "Not specified"}
            </p>
          </div>
          <div className="text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-gray-500">Servings</p>
            <p className="font-semibold">{meal.servings || 1}</p>
          </div>
        </div>

        {/* Availability Schedule */}
        {(meal.availableFrom || meal.availableTo) && (
          <div>
            <h3 className="font-semibold text-lg mb-3">
              Availability Schedule
            </h3>
            <div className="space-y-2">
              {meal.availableFrom && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">From:</span>
                  <span>{formatDateTime(meal.availableFrom)}</span>
                </div>
              )}
              {meal.availableTo && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">To:</span>
                  <span>{formatDateTime(meal.availableTo)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ingredients */}
        {meal.mainIngredients && meal.mainIngredients.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3">Main Ingredients</h3>
            <div className="grid grid-cols-2 gap-2">
              {meal.mainIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 bg-gray-50 rounded"
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-sm">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dietary Restrictions */}
        {meal.dietaryRestrictions && meal.dietaryRestrictions.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3">Dietary Information</h3>
            <div className="flex flex-wrap gap-2">
              {meal.dietaryRestrictions.map((restriction, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {restriction}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Spice Level */}
        {meal.spiceLevel && (
          <div>
            <h3 className="font-semibold text-lg mb-3">Spice Level</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                meal.spiceLevel === "Hot"
                  ? "bg-red-100 text-red-800"
                  : meal.spiceLevel === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {meal.spiceLevel}
            </span>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Created on {formatDate(meal.createdAt)}</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold">Delete Meal</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{meal.mealName}"? This action
              cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealDetailView;
