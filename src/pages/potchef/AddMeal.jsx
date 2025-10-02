import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Camera,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import { apiAddMeal } from "../../services/potchef";

const AddMeal = () => {
  const [formData, setFormData] = useState({
    mealName: "",
    description: "",
    price: "",
    servings: "",
    category: "",
    cuisine: "",
    spiceLevel: "Mild",
    dietaryRestrictions: [],
    mainIngredients: [],
    cookingTime: "",
    pickupLocation: "",
    availableFrom: "",
    availableTo: "",
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load SweetAlert2 from CDN
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const categories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Desserts",
    "Beverages",
    "Rice Dishes"
  ];

  const cuisines = [
    "African",
    "Asian",
    "European",
    "American",
    "Mediterranean",
    "Mexican",
    "Indian",
    "Chinese",
    "Italian",
    "Ghanaian",
    "Other"
  ];

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Halal",
    "Kosher",
    "Dairy-Free",
    "Nut-Free"
  ];

  const spiceLevels = [
    { value: "Mild", label: "Mild" },
    { value: "Medium", label: "Medium" },
    { value: "Hot", label: "Hot" },
    { value: "Very Hot", label: "Very Hot" }
  ];

  // Chef-inspired Success Alert
  const showSuccessAlert = () => {
    if (window.Swal) {
      window.Swal.fire({
        title: '🍳 Bon Appétit!',
        html: `
          <div style="font-size: 1.1em; color: #4b5563; line-height: 1.6;">
            <p style="margin: 10px 0;">Your delicious meal has been added to the menu!</p>
            <p style="font-size: 0.9em; color: #6b7280;">Ready to serve hungry customers 👨‍🍳</p>
          </div>
        `,
        icon: 'success',
        iconColor: '#f97316',
        confirmButtonText: '🎉 Perfect!',
        confirmButtonColor: '#f97316',
        background: '#fff',
        backdrop: 'rgba(249, 115, 22, 0.15)',
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__bounceIn'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOut'
        },
        customClass: {
          popup: 'chef-success-popup',
          title: 'chef-alert-title',
          htmlContainer: 'chef-alert-text'
        }
      });
    }
  };

  // Chef-inspired Error Alert
  const showErrorAlert = (errorMessage) => {
    if (window.Swal) {
      window.Swal.fire({
        title: '👨‍🍳 Kitchen Mishap!',
        html: `
          <div style="font-size: 1em; color: #4b5563; line-height: 1.6;">
            <p style="margin: 10px 0;">${errorMessage || 'Something went wrong in the kitchen.'}</p>
            <p style="font-size: 0.9em; color: #6b7280;">Don't worry, even master chefs have their moments!</p>
          </div>
        `,
        icon: 'error',
        iconColor: '#ef4444',
        confirmButtonText: '🔥 Try Again',
        confirmButtonColor: '#f97316',
        background: '#fff',
        backdrop: 'rgba(239, 68, 68, 0.15)',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOut'
        },
        customClass: {
          popup: 'chef-error-popup',
          title: 'chef-alert-title',
          htmlContainer: 'chef-alert-text'
        }
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDietaryChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(option)
        ? prev.dietaryRestrictions.filter((item) => item !== option)
        : [...prev.dietaryRestrictions, option],
    }));
  };

  const handleIngredientsChange = (e) => {
    const ingredients = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({
      ...prev,
      mainIngredients: ingredients
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files.slice(0, 5 - prev.length)]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare meal data
      const mealData = {
        mealName: formData.mealName,
        description: formData.description,
        price: Number(formData.price),
        servings: Number(formData.servings),
        category: formData.category,
        cuisine: formData.cuisine,
        spiceLevel: formData.spiceLevel,
        dietaryRestrictions: formData.dietaryRestrictions,
        mainIngredients: formData.mainIngredients,
        cookingTime: Number(formData.cookingTime),
        pickupLocation: formData.pickupLocation,
        availableFrom: new Date(formData.availableFrom).toISOString(),
        availableTo: new Date(formData.availableTo).toISOString()
      };

      let dataToSend;
      let apiCallConfig = {};

      if (images.length > 0) {
        // Create FormData and append each field individually
        const formDataToSend = new FormData();
        
        // Append non-array fields
        formDataToSend.append('mealName', mealData.mealName);
        formDataToSend.append('description', mealData.description);
        formDataToSend.append('price', mealData.price);
        formDataToSend.append('servings', mealData.servings);
        formDataToSend.append('category', mealData.category);
        formDataToSend.append('cuisine', mealData.cuisine);
        formDataToSend.append('spiceLevel', mealData.spiceLevel);
        formDataToSend.append('cookingTime', mealData.cookingTime);
        formDataToSend.append('pickupLocation', mealData.pickupLocation);
        formDataToSend.append('availableFrom', mealData.availableFrom);
        formDataToSend.append('availableTo', mealData.availableTo);
        
        // Handle arrays properly - append each item separately
        mealData.dietaryRestrictions.forEach((restriction, index) => {
          formDataToSend.append(`dietaryRestrictions[${index}]`, restriction);
        });
        
        mealData.mainIngredients.forEach((ingredient, index) => {
          formDataToSend.append(`mainIngredients[${index}]`, ingredient);
        });
        
        // Append images
        images.forEach((image, index) => {
          formDataToSend.append(`photos`, image);
        });
        
        dataToSend = formDataToSend;
        apiCallConfig = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
      } else {
        // No images, send as regular JSON
        dataToSend = mealData;
        apiCallConfig = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
      }

      // Call the API
      const response = await apiAddMeal(dataToSend, apiCallConfig);
      
      console.log('Meal added successfully:', response);
      
      // Show success alert
      showSuccessAlert();
      
      // Reset form after successful submission
      setFormData({
        mealName: "",
        description: "",
        price: "",
        servings: "",
        category: "",
        cuisine: "",
        spiceLevel: "Mild",
        dietaryRestrictions: [],
        mainIngredients: [],
        cookingTime: "",
        pickupLocation: "",
        availableFrom: "",
        availableTo: "",
      });
      setImages([]);
    } catch (err) {
      console.error('Error adding meal:', err);
      // Show error alert
      showErrorAlert(err.response?.data?.message || 'Failed to add meal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Add custom styles for SweetAlert animations */}
      <style>{`
        .chef-success-popup,
        .chef-error-popup {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          border-radius: 20px !important;
          padding: 2em 1em !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
        }
        
        .chef-alert-title {
          font-size: 1.8em !important;
          font-weight: 700 !important;
          margin-bottom: 0.5em !important;
        }
        
        .chef-alert-text {
          color: #4b5563 !important;
          font-size: 1em !important;
        }

        @keyframes bounceIn {
          from, 20%, 40%, 60%, 80%, to {
            animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
          }
          0% {
            opacity: 0;
            transform: scale3d(.3, .3, .3);
          }
          20% {
            transform: scale3d(1.1, 1.1, 1.1);
          }
          40% {
            transform: scale3d(.9, .9, .9);
          }
          60% {
            opacity: 1;
            transform: scale3d(1.03, 1.03, 1.03);
          }
          80% {
            transform: scale3d(.97, .97, .97);
          }
          to {
            opacity: 1;
            transform: scale3d(1, 1, 1);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes shakeX {
          from, to {
            transform: translate3d(0, 0, 0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translate3d(-10px, 0, 0);
          }
          20%, 40%, 60%, 80% {
            transform: translate3d(10px, 0, 0);
          }
        }

        .animate__animated {
          animation-duration: 0.6s;
          animation-fill-mode: both;
        }

        .animate__bounceIn {
          animation-name: bounceIn;
        }

        .animate__fadeOut {
          animation-name: fadeOut;
          animation-duration: 0.3s;
        }

        .animate__shakeX {
          animation-name: shakeX;
          animation-duration: 0.8s;
        }
      `}</style>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Add New Meal</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Name *
                </label>
                <input
                  type="text"
                  name="mealName"
                  value={formData.mealName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Jollof Rice with Grilled Chicken"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe your meal, what makes it special..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (GHS) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                      ¢
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="25.00"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servings *
                  </label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine *
                  </label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select cuisine</option>
                    {cuisines.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Photos</h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload photos of your meal
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="meal-images"
                />
                <label
                  htmlFor="meal-images"
                  className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600"
                >
                  Choose Photos
                </label>
                <p className="text-xs text-gray-500 mt-2">Max 5 photos</p>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Meal ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Additional Details</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spice Level
                </label>
                <div className="flex space-x-4">
                  {spiceLevels.map((level) => (
                    <label key={level.value} className="flex items-center">
                      <input
                        type="radio"
                        name="spiceLevel"
                        value={level.value}
                        checked={formData.spiceLevel === level.value}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Restrictions
                </label>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleDietaryChange(option)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.dietaryRestrictions.includes(option)
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  name="mainIngredients"
                  value={formData.mainIngredients.join(', ')}
                  onChange={handleIngredientsChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Rice, Chicken, Vegetables, Tomatoes"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cooking Time (minutes)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      name="cookingTime"
                      value={formData.cookingTime}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="30"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., East Legon, Accra"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available From *
                  </label>
                  <input
                    type="datetime-local"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available To *
                  </label>
                  <input
                    type="datetime-local"
                    name="availableTo"
                    value={formData.availableTo}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Adding...' : 'Add Meal'}
              </button>
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Save Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddMeal;