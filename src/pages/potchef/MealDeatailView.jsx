// src/components/meals/MealDetailView.jsx
import React from "react";
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
} from "lucide-react";

const MealDetailView = ({ meal, onBack, onEdit, onToggleAvailability }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-lg">Meal Details</h1>
        
        <button
          onClick={() => onEdit(meal)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Edit className="w-5 h-5 text-orange-600" />
        </button>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onToggleAvailability(meal.id)}
            className={`p-3 rounded-full ${
              meal.isAvailable ? "bg-green-500" : "bg-gray-500"
            } text-white shadow-lg`}
          >
            {meal.isAvailable ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              meal.isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {meal.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{meal.name}</h2>
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-orange-600">
              ${meal.price}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {meal.category}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed">{meal.description}</p>
        </div>

        {/* Rating & Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-5 h-5 fill-current text-yellow-400 mr-1" />
            <span className="font-semibold">{meal.rating}</span>
            <span className="text-gray-500 ml-1">
              ({meal.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{meal.location}</span>
          </div>
        </div>

        {/* Time & Servings */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-gray-500">Prep Time</p>
            <p className="font-semibold">{meal.prepTime}</p>
          </div>
          <div className="text-center">
            <ChefHat className="w-5 h-5 mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-gray-500">Cook Time</p>
            <p className="font-semibold">{meal.cookTime}</p>
          </div>
          <div className="text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-gray-500" />
            <p className="text-xs text-gray-500">Servings</p>
            <p className="font-semibold">{meal.servings}</p>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
          <div className="grid grid-cols-2 gap-2">
            {meal.ingredients.map((ingredient, index) => (
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

        {/* Nutrition Info */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Nutrition Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">Calories</p>
              <p className="font-bold text-lg">{meal.nutritionInfo.calories}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">Protein</p>
              <p className="font-bold text-lg">{meal.nutritionInfo.protein}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">Carbs</p>
              <p className="font-bold text-lg">{meal.nutritionInfo.carbs}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">Fat</p>
              <p className="font-bold text-lg">{meal.nutritionInfo.fat}</p>
            </div>
          </div>
        </div>

        {/* Allergens */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Allergens</h3>
          <div className="flex flex-wrap gap-2">
            {meal.allergens.map((allergen, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
              >
                {allergen}
              </span>
            ))}
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Created on {formatDate(meal.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default MealDetailView;
