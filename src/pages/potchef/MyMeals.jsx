import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  EyeOff,
  Star,
  MapPin,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  apiGetChefsMeals,
  apiGetChefsMealById,
  apiUpdateMeal,
  apiDeleteMeal,
  apiToggleMealAvailability,
} from "../../services/potchef";
import MealDetailView from "./MealDeatailView";
import EditMeal from "./EditMeal";

const MyMeals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [updating, setUpdating] = useState(false);



  const navigate = useNavigate();
  const location = useLocation();

  // Fetch chef's meals on component mount
  useEffect(() => {
    fetchChefMeals();
  }, []);

  // Handle URL navigation for meal details
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const mealId = urlParams.get("meal");

    if (mealId && !selectedMeal) {
      // Fetch specific meal details when navigating via URL
      fetchMealDetails(mealId);
    }
  }, [location.search, selectedMeal]);

  const fetchChefMeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGetChefsMeals();

      setMeals(response.assets || []);
      setTotalCount(response.count || 0);
    } catch (err) {
      console.error("Error fetching chef meals:", err);
      setError("Failed to load your meals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMealDetails = async (mealId) => {
    try {
      setLoading(true);
      const mealData = await apiGetChefsMealById(mealId);
      setSelectedMeal(mealData);

      // Update URL without triggering navigation
      const newUrl = new URL(window.location);
      newUrl.searchParams.set("meal", mealId);
      window.history.pushState({}, "", newUrl);
    } catch (err) {
      console.error("Error fetching meal details:", err);
      setError("Failed to load meal details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMeal = (meal) => {
    setSelectedMeal(meal);

    // Update URL to show meal details
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("meal", meal.id);
    window.history.pushState({}, "", newUrl);
  };

  const handleBackFromMeal = () => {
    setSelectedMeal(null);

    // Remove meal parameter from URL
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete("meal");
    window.history.pushState({}, "", newUrl);
  };

  const handleSaveEdit = async (updatedMealData) => {
    try {
      setUpdating(true);

      // Create FormData for the API call
      const formData = new FormData();

      // Add all meal fields to FormData
      Object.keys(updatedMealData).forEach((key) => {
        if (key === "photos" && Array.isArray(updatedMealData[key])) {
          // Handle photos array
          updatedMealData[key].forEach((photo) => {
            if (photo instanceof File) {
              formData.append("photos", photo);
            }
          });
        } else if (
          key === "ingredients" ||
          key === "allergens" ||
          key === "dietaryRestrictions"
        ) {
          // Handle arrays
          formData.append(key, JSON.stringify(updatedMealData[key]));
        } else if (key === "nutritionInfo") {
          // Handle nested object
          formData.append(key, JSON.stringify(updatedMealData[key]));
        } else if (key !== "photos") {
          // Handle regular fields
          formData.append(key, updatedMealData[key]);
        }
      });

      const response = await apiUpdateMeal(selectedMeal.id, formData);

      // Update meals list
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.id === selectedMeal.id ? { ...meal, ...response.meal } : meal
        )
      );

      setEditingMeal(null);
      setSelectedMeal({ ...selectedMeal, ...response.meal });
    } catch (err) {
      console.error("Error updating meal:", err);
      setError("Failed to update meal. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleAvailability = async (mealId, currentStatus) => {
  setUpdating(true);
  try {
    const updatedMeal = await apiToggleMealAvailability(mealId, currentStatus);
    // Update local state with the new meal data
    setMeals(prev =>
      prev.map(meal => (meal.id === mealId ? updatedMeal : meal))
    );
  } catch (err) {
    console.error(err);
  } finally {
    setUpdating(false);
  }
};


  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) {
      return;
    }

    try {
      await apiDeleteMeal(mealId);

      // Remove from meals list
      setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId));
      setTotalCount((prev) => prev - 1);

      // If this was the selected meal, go back to list
      if (selectedMeal && selectedMeal.id === mealId) {
        handleBackFromMeal();
      }
    } catch (err) {
      console.error("Error deleting meal:", err);
      setError("Failed to delete meal. Please try again.");
    }
  };

  const filteredMeals = meals.filter((meal) => {
  const matchesSearch =
    meal.mealName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.cuisine?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus = 
    filterStatus === 'all' || 
    (filterStatus === 'available' && (meal.status === 'available' || meal.status === 'Pending')) ||
    (filterStatus === 'unavailable' && meal.status !== 'available' && meal.status !== 'Pending');

  return matchesSearch && matchesStatus;
});

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Error component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-red-600 text-center mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
      >
        Retry
      </button>
    </div>
  );

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  );

  // Show editing component
  if (editingMeal) {
    return (
      <EditMeal
        meal={editingMeal}
        onSave={handleSaveEdit}
        onCancel={() => setEditingMeal(null)}
        updating={updating}
      />
    );
  }

  // Show meal detail view
  if (selectedMeal) {
    return (
      <MealDetailView
        meal={selectedMeal}
        onBack={handleBackFromMeal}
        onEdit={(meal) => setEditingMeal(meal)}
        onToggleAvailability={handleToggleAvailability}
        onDelete={handleDeleteMeal}
        updating={updating}
      />
    );
  }

  // Main meals list view
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-4">My Meals</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="available">Available & Pending</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{totalCount}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {
                meals.filter(
                  (m) => m.status === "available" || m.status === "Pending"
                ).length
              }
            </div>
            <div className="text-sm text-gray-500">Available</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              {
                meals.filter(
                  (m) => m.status !== "available" && m.status !== "Pending"
                ).length
              }
            </div>
            <div className="text-sm text-gray-500">Unavailable</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <LoadingSpinner />
        ) : error && meals.length === 0 ? (
          <ErrorMessage message={error} onRetry={fetchChefMeals} />
        ) : filteredMeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No meals found</div>
            <p className="text-gray-600">
              {meals.length === 0
                ? "You haven't added any meals yet. Create your first meal!"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={meal.photos?.[0] || "/api/placeholder/80/80"}
                        alt={meal.mealName || "Meal"}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
  onClick={() => handleToggleAvailability(meal.id, meal.status)}

                        className={`absolute -top-2 -right-2 p-1 rounded-full ${
                          meal.status?.toLowerCase() === "available"

                            ? "bg-green-500"
                            : "bg-gray-500"
                        } text-white shadow-sm`}
                      >
                        {meal.status === "available" ||
                        meal.status === "unavailable" ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 truncate pr-2">
                          {meal.mealName || "Unnamed Meal"}
                        </h3>
                        <span className="text-lg font-bold text-orange-600 whitespace-nowrap">
                          ¢{meal.price || "0.00"}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">
                          {meal.pickupLocation || "Location not set"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-600">
                            {meal.cuisine || "Cuisine"}
                          </span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-600">
                            {meal.servings || 1} servings
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            meal.status === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {meal.status === "available"
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{formatDate(meal.createdAt)}</span>
                        </div>
                        <button
                          onClick={() => handleViewMeal(meal)}
                          className="text-orange-600 text-sm font-medium hover:text-orange-700"
                        >
                          View Details
                        </button>
                      </div>
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

export default MyMeals;
