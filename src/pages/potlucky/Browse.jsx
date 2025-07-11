import React, { useState } from 'react';
import { Grid, List, Edit, Eye, EyeOff, Clock, DollarSign, Star, MapPin, MoreVertical, Search, Filter } from 'lucide-react';

const Browse = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'available', 'unavailable'
  
  // Sample meals data - replace with actual data from your API
  const [meals, setMeals] = useState([
    {
      id: 1,
      name: "Jollof Rice with Grilled Chicken",
      price: 25.00,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
      description: "Perfectly seasoned jollof rice served with tender grilled chicken and plantain.",
      category: "Main Course",
      prepTime: "30 mins",
      rating: 4.8,
      reviewCount: 24,
      isAvailable: true,
      location: "Accra, Ghana",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Kelewele with Groundnut Soup",
      price: 15.00,
      image: "https://images.unsplash.com/photo-1596040767493-75c5c2e5d355?w=400&h=300&fit=crop",
      description: "Spicy fried plantain cubes served with rich groundnut soup.",
      category: "Traditional",
      prepTime: "45 mins",
      rating: 4.6,
      reviewCount: 18,
      isAvailable: false,
      location: "Kumasi, Ghana",
      createdAt: "2024-01-10"
    },
    {
      id: 3,
      name: "Banku with Tilapia",
      price: 20.00,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      description: "Fresh tilapia grilled to perfection served with banku and spicy pepper sauce.",
      category: "Seafood",
      prepTime: "25 mins",
      rating: 4.9,
      reviewCount: 32,
      isAvailable: true,
      location: "Tema, Ghana",
      createdAt: "2024-01-12"
    },
    {
      id: 4,
      name: "Waakye with Stew",
      price: 12.00,
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      description: "Traditional waakye with beef stew, boiled egg, and gari.",
      category: "Traditional",
      prepTime: "40 mins",
      rating: 4.7,
      reviewCount: 15,
      isAvailable: true,
      location: "Accra, Ghana",
      createdAt: "2024-01-08"
    },
    {
      id: 5,
      name: "Fufu with Light Soup",
      price: 18.00,
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      description: "Soft fufu served with aromatic light soup and assorted meat.",
      category: "Traditional",
      prepTime: "35 mins",
      rating: 4.5,
      reviewCount: 21,
      isAvailable: false,
      location: "Accra, Ghana",
      createdAt: "2024-01-05"
    },
    {
      id: 6,
      name: "Red Red with Plantain",
      price: 10.00,
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
      description: "Delicious red red (bean stew) served with fried plantain.",
      category: "Traditional",
      prepTime: "20 mins",
      rating: 4.4,
      reviewCount: 12,
      isAvailable: true,
      location: "Kumasi, Ghana",
      createdAt: "2024-01-03"
    }
  ]);

  // Toggle availability status
  const toggleAvailability = (mealId) => {
    setMeals(prevMeals =>
      prevMeals.map(meal =>
        meal.id === mealId ? { ...meal, isAvailable: !meal.isAvailable } : meal
      )
    );
  };

  // Filter meals based on search and status
  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'available' && meal.isAvailable) ||
                         (filterStatus === 'unavailable' && !meal.isAvailable);
    return matchesSearch && matchesStatus;
  });

  // Grid view component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMeals.map(meal => (
        <div key={meal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative">
            <img 
              src={meal.image} 
              alt={meal.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={() => toggleAvailability(meal.id)}
                className={`p-2 rounded-full ${meal.isAvailable ? 'bg-green-500' : 'bg-gray-500'} text-white`}
              >
                {meal.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <div className="absolute bottom-2 left-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                meal.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {meal.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{meal.name}</h3>
              <span className="text-lg font-bold text-orange-600">${meal.price}</span>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{meal.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {meal.prepTime}
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                {meal.rating} ({meal.reviewCount})
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {meal.location}
              </div>
              <span className="bg-gray-100 px-2 py-1 rounded">{meal.category}</span>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // List view component
  const ListView = () => (
    <div className="space-y-4">
      {filteredMeals.map(meal => (
        <div key={meal.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex gap-4">
            <div className="relative">
              <img 
                src={meal.image} 
                alt={meal.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="absolute -top-2 -right-2">
                <button
                  onClick={() => toggleAvailability(meal.id)}
                  className={`p-1 rounded-full ${meal.isAvailable ? 'bg-green-500' : 'bg-gray-500'} text-white`}
                >
                  {meal.isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{meal.name}</h3>
                  <p className="text-gray-600 text-sm">{meal.description}</p>
                </div>
                <span className="text-lg font-bold text-orange-600">${meal.price}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {meal.prepTime}
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                  {meal.rating} ({meal.reviewCount})
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {meal.location}
                </div>
                <span className="bg-gray-100 px-2 py-1 rounded">{meal.category}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  meal.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {meal.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Meals</h1>
        <p className="text-gray-600">Manage your posted meals and their availability</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Meals</div>
          <div className="text-2xl font-bold text-gray-900">{meals.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Available</div>
          <div className="text-2xl font-bold text-green-600">{meals.filter(m => m.isAvailable).length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Unavailable</div>
          <div className="text-2xl font-bold text-red-600">{meals.filter(m => !m.isAvailable).length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Avg. Rating</div>
          <div className="text-2xl font-bold text-orange-600">
            {(meals.reduce((sum, meal) => sum + meal.rating, 0) / meals.length).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Meals Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        {filteredMeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No meals found</div>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? <GridView /> : <ListView />}
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;