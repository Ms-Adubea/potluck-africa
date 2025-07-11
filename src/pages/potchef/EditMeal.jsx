// src/components/meals/EditMeal.jsx
import React, { useState } from 'react';
import { ArrowLeft, Save, Image, Clock, Users, X } from 'lucide-react';

const EditMeal = ({ meal, onSave, onCancel }) => {
  const [editedMeal, setEditedMeal] = useState({ ...meal });
  const [newIngredient, setNewIngredient] = useState('');
  const [newAllergen, setNewAllergen] = useState('');

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
        ingredients: [...prev.ingredients, newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (index) => {
    setEditedMeal(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addAllergen = () => {
    if (newAllergen.trim()) {
      setEditedMeal(prev => ({
        ...prev,
        allergens: [...prev.allergens, newAllergen.trim()]
      }));
      setNewAllergen('');
    }
  };

  const removeAllergen = (index) => {
    setEditedMeal(prev => ({
      ...prev,
      allergens: prev.allergens.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedMeal(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedMeal);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-lg">Edit Meal</h1>
        <button 
          type="submit" 
          form="edit-meal-form"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Save className="w-5 h-5 text-green-600" />
        </button>
      </div>

      {/* Edit Form */}
      <form id="edit-meal-form" onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Image Upload */}
        <div className="relative">
          <img 
            src={editedMeal.image} 
            alt={editedMeal.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <label className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="hidden"
            />
            <Image className="w-5 h-5 text-gray-700" />
          </label>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
            <input
              type="text"
              name="name"
              value={editedMeal.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={editedMeal.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={editedMeal.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Main Course">Main Course</option>
                <option value="Traditional">Traditional</option>
                <option value="Seafood">Seafood</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={editedMeal.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Time & Servings */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="flex items-center text-sm text-gray-500 mb-1">
              <Clock className="w-4 h-4 mr-1" /> Prep Time
            </label>
            <input
              type="text"
              name="prepTime"
              value={editedMeal.prepTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center text-sm text-gray-500 mb-1">
              <Clock className="w-4 h-4 mr-1" /> Cook Time
            </label>
            <input
              type="text"
              name="cookTime"
              value={editedMeal.cookTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center text-sm text-gray-500 mb-1">
              <Users className="w-4 h-4 mr-1" /> Servings
            </label>
            <input
              type="number"
              name="servings"
              value={editedMeal.servings}
              onChange={handleChange}
              min="1"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Add new ingredient"
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addIngredient}
              className="bg-orange-500 text-white px-4 rounded-r-lg hover:bg-orange-600"
            >
              Add
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {editedMeal.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-sm">{ingredient}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nutrition Information</label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm text-gray-500 mb-1">Calories</label>
              <input
                type="number"
                name="calories"
                value={editedMeal.nutritionInfo.calories}
                onChange={handleNutritionChange}
                min="0"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm text-gray-500 mb-1">Protein (g)</label>
              <input
                type="text"
                name="protein"
                value={editedMeal.nutritionInfo.protein}
                onChange={handleNutritionChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm text-gray-500 mb-1">Carbs (g)</label>
              <input
                type="text"
                name="carbs"
                value={editedMeal.nutritionInfo.carbs}
                onChange={handleNutritionChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm text-gray-500 mb-1">Fat (g)</label>
              <input
                type="text"
                name="fat"
                value={editedMeal.nutritionInfo.fat}
                onChange={handleNutritionChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Allergens */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Allergens</label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newAllergen}
              onChange={(e) => setNewAllergen(e.target.value)}
              placeholder="Add new allergen"
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addAllergen}
              className="bg-orange-500 text-white px-4 rounded-r-lg hover:bg-orange-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {editedMeal.allergens.map((allergen, index) => (
              <div key={index} className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                {allergen}
                <button
                  type="button"
                  onClick={() => removeAllergen(index)}
                  className="ml-2 text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={editedMeal.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default EditMeal;