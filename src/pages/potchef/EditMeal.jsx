import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Image, Clock, Users, X, Plus, Camera, MapPin, DollarSign, ChefHat, Loader2 } from 'lucide-react';

const EditMeal = ({ meal, onSave, onCancel, isLoading }) => {
  // Initialize with safe defaults for arrays and objects
  const [editedMeal, setEditedMeal] = useState({
    ...meal,
    mainIngredients: meal?.mainIngredients || meal?.ingredients || [],
    dietaryRestrictions: meal?.dietaryRestrictions || meal?.allergens || [],
    nutritionInfo: meal?.nutritionInfo || {
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    }
  });
  const [newIngredient, setNewIngredient] = useState('');
  const [newDietaryRestriction, setNewDietaryRestriction] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Update form when meal prop changes
  useEffect(() => {
    setEditedMeal({
      ...meal,
      mainIngredients: meal?.mainIngredients || meal?.ingredients || [],
      dietaryRestrictions: meal?.dietaryRestrictions || meal?.allergens || [],
      nutritionInfo: meal?.nutritionInfo || {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      }
    });
  }, [meal]);

  // Toast notification function
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    toast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          ${type === 'success' 
            ? '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>'
            : '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>'
          }
        </svg>
        ${message}
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMeal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setEditedMeal(prev => ({
      ...prev,
      nutritionInfo: {
        ...prev.nutritionInfo,
        [name]: value
      }
    }));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setEditedMeal(prev => ({
        ...prev,
        mainIngredients: [...(prev.mainIngredients || []), newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (index) => {
    setEditedMeal(prev => ({
      ...prev,
      mainIngredients: (prev.mainIngredients || []).filter((_, i) => i !== index)
    }));
  };

  const addDietaryRestriction = () => {
    if (newDietaryRestriction.trim()) {
      setEditedMeal(prev => ({
        ...prev,
        dietaryRestrictions: [...(prev.dietaryRestrictions || []), newDietaryRestriction.trim()]
      }));
      setNewDietaryRestriction('');
    }
  };

  const removeDietaryRestriction = (index) => {
    setEditedMeal(prev => ({
      ...prev,
      dietaryRestrictions: (prev.dietaryRestrictions || []).filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files]);
    
    // For preview purposes
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedMeal(prev => ({
          ...prev,
          photos: [...(prev.photos || []), reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setEditedMeal(prev => ({
      ...prev,
      photos: (prev.photos || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!editedMeal.mealName && !editedMeal.name) {
      showToast('Please enter a meal name', 'error');
      return;
    }
    
    if (!editedMeal.description) {
      showToast('Please enter a description', 'error');
      return;
    }
    
    if (!editedMeal.price || editedMeal.price <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    setIsSaving(true);
    
    try {
      // Create FormData for API submission
      const formData = new FormData();
      
      // Map the edited meal data to match API expectations
      const mealData = {
        id: editedMeal.id, // Include the meal ID for updates
        mealName: editedMeal.name || editedMeal.mealName,
        description: editedMeal.description,
        price: parseFloat(editedMeal.price),
        servings: parseInt(editedMeal.servings) || 1,
        category: editedMeal.category || 'Main Course',
        cuisine: editedMeal.cuisine || 'Local',
        spiceLevel: editedMeal.spiceLevel || 'Mild',
        dietaryRestrictions: editedMeal.dietaryRestrictions || [],
        mainIngredients: editedMeal.mainIngredients || [],
        cookingTime: parseInt(editedMeal.cookTime || editedMeal.cookingTime) || 30,
        pickupLocation: editedMeal.location || editedMeal.pickupLocation || '',
        availableFrom: editedMeal.availableFrom || "09:00",
        availableTo: editedMeal.availableTo || "21:00",
        nutritionInfo: editedMeal.nutritionInfo
      };

      // Append non-file data
      Object.keys(mealData).forEach(key => {
        if (Array.isArray(mealData[key])) {
          // Handle arrays properly
          mealData[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (typeof mealData[key] === 'object' && mealData[key] !== null) {
          // Handle nested objects like nutritionInfo
          Object.keys(mealData[key]).forEach(subKey => {
            if (mealData[key][subKey]) {
              formData.append(`${key}.${subKey}`, mealData[key][subKey]);
            }
          });
        } else if (mealData[key] !== undefined && mealData[key] !== null) {
          formData.append(key, mealData[key]);
        }
      });

      // Append selected image files
      selectedImages.forEach((file, index) => {
        formData.append('photos', file);
      });

      // Call the onSave function with proper error handling
      const result = await onSave(formData, editedMeal.id);
      
      if (result && result.success !== false) {
        showToast('Meal updated successfully!');
        // Small delay to show success message before navigation
        setTimeout(() => {
          onCancel(); // This will navigate back to the detail view
        }, 1000);
      } else {
        throw new Error(result?.message || 'Failed to update meal');
      }
      
    } catch (error) {
      console.error('Error updating meal:', error);
      showToast(error.message || 'Failed to update meal. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const commonDietaryRestrictions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
    'Halal', 'Kosher', 'Low-Sodium', 'Keto-Friendly', 'Diabetic-Friendly'
  ];

  const spiceLevels = ['Mild', 'Medium', 'Hot', 'Very Hot'];
  const cuisineTypes = ['Local', 'Continental', 'Chinese', 'Italian', 'Indian', 'Mexican', 'Thai', 'Lebanese'];
  const categories = ['Main Course', 'Traditional', 'Seafood', 'Breakfast', 'Dessert', 'Appetizer', 'Beverage', 'Snacks'];

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      {/* Enhanced Header with gradient */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button 
            onClick={onCancel} 
            className="p-2.5 hover:bg-orange-100 rounded-full transition-colors duration-200"
            disabled={isSaving}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center space-x-2">
            <ChefHat className="w-5 h-5 text-orange-600" />
            <h1 className="font-bold text-lg text-gray-800">Edit Meal</h1>
          </div>
          <button 
            type="submit" 
            form="edit-meal-form"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2.5 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Form */}
      <form id="edit-meal-form" onSubmit={handleSubmit} className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Enhanced Image Upload Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-orange-600" />
            Meal Photos
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {(editedMeal.photos || []).map((photo, index) => (
              <div key={index} className="relative group">
                <img 
                  src={photo} 
                  alt={`Meal photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-xl border-2 border-orange-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {/* Add Photo Button */}
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-orange-300 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors duration-200">
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <Plus className="w-8 h-8 text-orange-400 mb-2" />
              <span className="text-sm text-orange-600 font-medium">Add Photos</span>
            </label>
          </div>
        </div>

        {/* Enhanced Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Name *</label>
            <input
              type="text"
              name="mealName"
              value={editedMeal.mealName || editedMeal.name || ''}
              onChange={(e) => setEditedMeal(prev => ({ ...prev, mealName: e.target.value, name: e.target.value }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter delicious meal name..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 items-center">
              {/* <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"> */}
                <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                Price (¢) *
              </label>
              <input
                type="number"
                name="price"
                value={editedMeal.price || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={editedMeal.category || ''}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cuisine Type</label>
              <select
                name="cuisine"
                value={editedMeal.cuisine || ''}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Spice Level</label>
              <select
                name="spiceLevel"
                value={editedMeal.spiceLevel || 'Mild'}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                {spiceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={editedMeal.description || ''}
              onChange={handleChange}
              rows="4"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe your amazing meal..."
              required
            />
          </div>
        </div>

        {/* Enhanced Time & Servings */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Details</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-1 text-blue-600" /> Cooking Time (min)
              </label>
              <input
                type="number"
                name="cookingTime"
                value={editedMeal.cookingTime || editedMeal.cookTime || ''}
                onChange={(e) => setEditedMeal(prev => ({ ...prev, cookingTime: e.target.value, cookTime: e.target.value }))}
                min="1"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="30"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-4 h-4 mr-1 text-purple-600" /> Servings
              </label>
              <input
                type="number"
                name="servings"
                value={editedMeal.servings || 1}
                onChange={handleChange}
                min="1"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="1"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-1 text-red-600" /> Pickup Location *
              </label>
              <input
                type="text"
                name="pickupLocation"
                value={editedMeal.pickupLocation || editedMeal.location || ''}
                onChange={(e) => setEditedMeal(prev => ({ ...prev, pickupLocation: e.target.value, location: e.target.value }))}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Location..."
                required
              />
            </div>
          </div>
        </div>

        {/* Enhanced Ingredients */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Main Ingredients</h3>
          <div className="flex mb-4">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Add main ingredient..."
              className="flex-1 p-4 border-2 border-gray-200 rounded-l-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
            />
            <button
              type="button"
              onClick={addIngredient}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 rounded-r-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
            >
              Add
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {(editedMeal.mainIngredients || []).map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3"></div>
                  <span className="font-medium text-gray-700">{ingredient}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Nutrition Info */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nutrition Information</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <label className="block text-sm font-semibold text-blue-700 mb-2">Calories</label>
              <input
                type="number"
                name="calories"
                value={editedMeal.nutritionInfo?.calories || ''}
                onChange={handleNutritionChange}
                min="0"
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="0"
              />
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <label className="block text-sm font-semibold text-green-700 mb-2">Protein (g)</label>
              <input
                type="text"
                name="protein"
                value={editedMeal.nutritionInfo?.protein || ''}
                onChange={handleNutritionChange}
                className="w-full p-3 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="0g"
              />
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <label className="block text-sm font-semibold text-yellow-700 mb-2">Carbs (g)</label>
              <input
                type="text"
                name="carbs"
                value={editedMeal.nutritionInfo?.carbs || ''}
                onChange={handleNutritionChange}
                className="w-full p-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                placeholder="0g"
              />
            </div>
            <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
              <label className="block text-sm font-semibold text-red-700 mb-2">Fat (g)</label>
              <input
                type="text"
                name="fat"
                value={editedMeal.nutritionInfo?.fat || ''}
                onChange={handleNutritionChange}
                className="w-full p-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="0g"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Dietary Restrictions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dietary Restrictions</h3>
          
          {/* Quick Select Common Restrictions */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {commonDietaryRestrictions.map(restriction => (
                <button
                  key={restriction}
                  type="button"
                  onClick={() => {
                    if (!(editedMeal.dietaryRestrictions || []).includes(restriction)) {
                      setEditedMeal(prev => ({
                        ...prev,
                        dietaryRestrictions: [...(prev.dietaryRestrictions || []), restriction]
                      }));
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    (editedMeal.dietaryRestrictions || []).includes(restriction)
                      ? 'bg-red-200 text-red-800 cursor-not-allowed opacity-50'
                      : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
                  }`}
                  disabled={(editedMeal.dietaryRestrictions || []).includes(restriction)}
                >
                  {restriction}
                </button>
              ))}
            </div>
          </div>

          <div className="flex mb-4">
            <input
              type="text"
              value={newDietaryRestriction}
              onChange={(e) => setNewDietaryRestriction(e.target.value)}
              placeholder="Add custom dietary restriction..."
              className="flex-1 p-4 border-2 border-gray-200 rounded-l-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDietaryRestriction())}
            />
            <button
              type="button"
              onClick={addDietaryRestriction}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 rounded-r-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {(editedMeal.dietaryRestrictions || []).map((restriction, index) => (
              <div key={index} className="flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 rounded-full text-sm font-medium border border-red-200">
                {restriction}
                <button
                  type="button"
                  onClick={() => removeDietaryRestriction(index)}
                  className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Overlay */}
        {isSaving && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4"></div>
              <div className="text-orange-600 font-medium text-lg">Updating your meal...</div>
              <div className="text-gray-500 text-sm mt-2">Please wait while we save your changes</div>
            </div>
          </div>
        )}

        {/* Save Button for mobile */}
        <div className="md:hidden">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Saving Changes...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMeal;