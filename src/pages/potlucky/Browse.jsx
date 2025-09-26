// import React, { useState, useEffect } from 'react';
// import { Search, Filter, MapPin, Star, Clock, DollarSign, Heart, ShoppingCart, ChefHat, X, SlidersHorizontal, Plus, Check } from 'lucide-react';
// import { apiGetAllMeals } from '../../services/potlucky';
// // import { useFavorites } from '../../contexts/FavoritesContext';
// // import { useCart } from '../../contexts/CartContext';
// import { useNavigate } from 'react-router-dom';
// import { useFavorites } from '../../contexts/FavoritesContext';
// import { useCart } from '../../contexts/CartContext';

// const Browse = () => {
//   const [meals, setMeals] = useState([]);
//   const [filteredMeals, setFilteredMeals] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [addingToCart, setAddingToCart] = useState(new Set());
//   const [showSuccessMessage, setShowSuccessMessage] = useState(null);
  
//   const navigate = useNavigate();
//   const { favorites, toggleFavorite, isFavorite } = useFavorites();
//   const { addToCart, getItemCount } = useCart();

//   const handleViewMeal = (mealId) => {
//     navigate(`/dashboard/potlucky/browse/${mealId}`);
//   };

//   // Filter states
//   const [filters, setFilters] = useState({
//     location: '',
//     cuisine: '',
//     minPrice: '',
//     maxPrice: '',
//     rating: '',
//     deliveryTime: ''
//   });

//   const cuisineTypes = ['All', 'Ghanaian', 'West African', 'Nigerian', 'Ivorian', 'African'];
//   const locations = ['All', 'East Legon, Accra', 'Tema, Accra', 'Kumasi', 'Takoradi', 'Tamale', 'Lapaz, Accra', 'Madina, Accra'];
//   const priceRanges = [
//     { label: 'All', min: '', max: '' },
//     { label: 'Under ¢20', min: '', max: '20' },
//     { label: '¢20-¢30', min: '20', max: '30' },
//     { label: '¢30-¢40', min: '30', max: '40' },
//     { label: 'Over ¢40', min: '40', max: '' }
//   ];

//   // Transform API data to match component expectations
//   const transformMealData = (apiMeal) => {
//     return {
//       id: apiMeal.id,
//       name: apiMeal.mealName,
//       description: apiMeal.description,
//       price: apiMeal.price,
//       cuisine: apiMeal.cuisine,
//       location: apiMeal.pickupLocation,
//       rating: apiMeal.averageRating || 0,
//       reviewCount: apiMeal.reviewCount || 0,
//       available: apiMeal.status === 'Available',
//       deliveryTime: `${apiMeal.cookingTime} mins`,
//       image: apiMeal.photos && apiMeal.photos.length > 0 ? apiMeal.photos[0] : '/api/placeholder/300/200',
//       chef: {
//         name: `${apiMeal.createdBy.firstName} ${apiMeal.createdBy.lastName}`,
//         rating: 4.5
//       },
//       tags: [
//         apiMeal.category,
//         apiMeal.spiceLevel,
//         ...apiMeal.dietaryRestrictions,
//         `${apiMeal.servings} serving${apiMeal.servings > 1 ? 's' : ''}`
//       ].filter(Boolean),
//       // Include full meal data for cart
//       fullMealData: apiMeal
//     };
//   };

//   useEffect(() => {
//     const fetchMeals = async () => {
//       try {
//         const response = await apiGetAllMeals();
//         const transformedMeals = response.map(transformMealData);
//         setMeals(transformedMeals);
//         setFilteredMeals(transformedMeals);
//       } catch (error) {
//         console.error('Failed to fetch meals:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMeals();
//   }, []);

//   useEffect(() => {
//     filterMeals();
//   }, [searchTerm, filters, meals]);

//   const filterMeals = () => {
//     let filtered = meals;

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(meal => 
//         meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         meal.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         meal.chef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         meal.description.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Location filter
//     if (filters.location && filters.location !== 'All') {
//       filtered = filtered.filter(meal => meal.location === filters.location);
//     }

//     // Cuisine filter
//     if (filters.cuisine && filters.cuisine !== 'All') {
//       filtered = filtered.filter(meal => meal.cuisine === filters.cuisine);
//     }

//     // Price filter
//     if (filters.minPrice) {
//       filtered = filtered.filter(meal => meal.price >= parseFloat(filters.minPrice));
//     }
//     if (filters.maxPrice) {
//       filtered = filtered.filter(meal => meal.price <= parseFloat(filters.maxPrice));
//     }

//     // Rating filter
//     if (filters.rating) {
//       filtered = filtered.filter(meal => meal.rating >= parseFloat(filters.rating));
//     }

//     setFilteredMeals(filtered);
//   };

//   const handleToggleFavorite = async (mealId, event) => {
//     event.stopPropagation(); // Prevent navigation when clicking heart
//     await toggleFavorite(mealId);
//   };

//   const handleAddToCart = async (meal, event) => {
//     event.stopPropagation(); // Prevent navigation when clicking add to cart
    
//     if (!meal.available) return;
    
//     setAddingToCart(prev => new Set(prev).add(meal.id));
    
//     try {
//       const result = await addToCart(meal.fullMealData, 1);
      
//       if (result.success) {
//         setShowSuccessMessage(meal.id);
//         setTimeout(() => setShowSuccessMessage(null), 2000);
//       }
//     } catch (error) {
//       console.error('Failed to add to cart:', error);
//     } finally {
//       setAddingToCart(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(meal.id);
//         return newSet;
//       });
//     }
//   };

//   const clearFilters = () => {
//     setFilters({
//       location: '',
//       cuisine: '',
//       minPrice: '',
//       maxPrice: '',
//       rating: '',
//       deliveryTime: ''
//     });
//     setSearchTerm('');
//   };

//   const applyPriceRange = (range) => {
//     setFilters(prev => ({
//       ...prev,
//       minPrice: range.min,
//       maxPrice: range.max
//     }));
//   };

//   const showSuccessToast = (message) => {
//     // You can implement a proper toast notification here
//     if ('Notification' in window && Notification.permission === 'granted') {
//       new Notification('Potlucky', { body: message, icon: '/icon-192x192.png' });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4 space-y-6 pb-20">
//       {/* Header with Cart Count */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900">Browse Meals</h1>
//         <div className="flex items-center space-x-3">
//           <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
//             {filteredMeals.length} meals
//           </div>
//           <div className="relative">
//             <button 
//               onClick={() => navigate('/cart')}
//               className="p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
//             >
//               <ShoppingCart className="w-5 h-5" />
//             </button>
//             {getItemCount() > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {getItemCount()}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//         <input
//           type="text"
//           placeholder="Search meals, chefs, or cuisine..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//         />
//       </div>

//       {/* Quick Filters & Filter Button */}
//       <div className="flex items-center space-x-2 overflow-x-auto pb-2">
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex-shrink-0"
//         >
//           <SlidersHorizontal className="w-4 h-4" />
//           <span>Filters</span>
//         </button>
        
//         {cuisineTypes.slice(0, 4).map((cuisine) => (
//           <button
//             key={cuisine}
//             onClick={() => setFilters(prev => ({ ...prev, cuisine: cuisine === 'All' ? '' : cuisine }))}
//             className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//               filters.cuisine === cuisine || (cuisine === 'All' && !filters.cuisine)
//                 ? 'bg-orange-100 text-orange-800 border border-orange-200'
//                 : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
//             }`}
//           >
//             {cuisine}
//           </button>
//         ))}
//       </div>

//       {/* Advanced Filters Panel */}
//       {showFilters && (
//         <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
//             <button
//               onClick={() => setShowFilters(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Location Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
//               <select
//                 value={filters.location}
//                 onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               >
//                 {locations.map(location => (
//                   <option key={location} value={location === 'All' ? '' : location}>
//                     {location}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Cuisine Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
//               <select
//                 value={filters.cuisine}
//                 onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               >
//                 {cuisineTypes.map(cuisine => (
//                   <option key={cuisine} value={cuisine === 'All' ? '' : cuisine}>
//                     {cuisine}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Price Range */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
//               <div className="flex flex-wrap gap-2">
//                 {priceRanges.map((range, index) => (
//                   <button
//                     key={index}
//                     onClick={() => applyPriceRange(range)}
//                     className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                       filters.minPrice === range.min && filters.maxPrice === range.max
//                         ? 'bg-orange-100 text-orange-800 border border-orange-200'
//                         : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
//                     }`}
//                   >
//                     {range.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Rating Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
//               <select
//                 value={filters.rating}
//                 onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               >
//                 <option value="">Any Rating</option>
//                 <option value="4.5">4.5+ Stars</option>
//                 <option value="4.0">4.0+ Stars</option>
//                 <option value="3.5">3.5+ Stars</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex space-x-2">
//             <button
//               onClick={clearFilters}
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Clear All
//             </button>
//             <button
//               onClick={() => setShowFilters(false)}
//               className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Meals Grid */}
//       <div className="space-y-4">
//         {filteredMeals.length === 0 ? (
//           <div className="text-center py-12">
//             <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No meals found</h3>
//             <p className="text-gray-500">
//               Try adjusting your search or filters to find what you're looking for
//             </p>
//           </div>
//         ) : (
//           filteredMeals.map((meal) => (
//             <div key={meal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//               <div className="md:flex">
//                 {/* Make the image clickable */}
//                 <div 
//                   className="md:w-48 md:flex-shrink-0 cursor-pointer"
//                   onClick={() => handleViewMeal(meal.id)}
//                 >
//                   <img
//                     src={meal.image}
//                     alt={meal.name}
//                     className="w-full h-48 md:h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = 'https://nyonyogh.com/wp-content/uploads/2024/01/d19188f6dcc876c7181db2797e951b70-540x440.jpg';
//                     }}
//                   />
//                 </div>

//                 {/* Meal Details */}
//                 <div className="p-4 flex-1">
//                   <div className="flex justify-between items-start mb-2">
//                     <div 
//                       className="cursor-pointer flex-1"
//                       onClick={() => handleViewMeal(meal.id)}
//                     >
//                       <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-orange-600">
//                         {meal.name}
//                       </h3>
//                       <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
//                     </div>
//                     <button
//                       onClick={(e) => handleToggleFavorite(meal.id, e)}
//                       className={`p-2 rounded-full transition-colors ${
//                         isFavorite(meal.id)
//                           ? 'bg-red-100 text-red-600'
//                           : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
//                       }`}
//                     >
//                       <Heart className={`w-5 h-5 ${isFavorite(meal.id) ? 'fill-current' : ''}`} />
//                     </button>
//                   </div>

//                   {/* Chef Info */}
//                   <div className="flex items-center space-x-2 mb-3">
//                     <ChefHat className="w-4 h-4 text-gray-400" />
//                     <span className="text-sm text-gray-600">{meal.chef.name}</span>
//                     <div className="flex items-center space-x-1">
//                       <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                       <span className="text-sm text-gray-600">{meal.chef.rating}</span>
//                     </div>
//                   </div>

//                   {/* Meal Meta */}
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center space-x-4">
//                       <div className="flex items-center space-x-1">
//                         <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                         <span className="text-sm font-medium">{meal.rating || 'New'}</span>
//                         <span className="text-sm text-gray-500">({meal.reviewCount})</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Clock className="w-4 h-4 text-gray-400" />
//                         <span className="text-sm text-gray-600">{meal.deliveryTime}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <MapPin className="w-4 h-4 text-gray-400" />
//                         <span className="text-sm text-gray-600">{meal.location}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Tags */}
//                   <div className="flex flex-wrap gap-1 mb-3">
//                     {meal.tags.map((tag, index) => (
//                       <span
//                         key={index}
//                         className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>

//                   {/* Price and Action */}
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-1">
//                       <span className="text-sm text-gray-500">¢</span>
//                       <span className="text-2xl font-bold text-green-600">{meal.price}</span>
//                     </div>
//                     <button
//                       onClick={(e) => handleAddToCart(meal, e)}
//                       disabled={!meal.available || addingToCart.has(meal.id)}
//                       className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
//                         meal.available
//                           ? 'bg-orange-600 text-white hover:bg-orange-700'
//                           : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                       }`}
//                     >
//                       {addingToCart.has(meal.id) ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                           <span>Adding...</span>
//                         </>
//                       ) : showSuccessMessage === meal.id ? (
//                         <>
//                           <Check className="w-4 h-4" />
//                           <span>Added!</span>
//                         </>
//                       ) : (
//                         <>
//                           <ShoppingCart className="w-4 h-4" />
//                           <span>{meal.available ? 'Add to Cart' : 'Unavailable'}</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Browse;


import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Clock, Heart, ChefHat, X, SlidersHorizontal } from 'lucide-react';
import { apiGetAllMeals } from '../../services/potlucky';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useNavigate } from 'react-router-dom';

const Browse = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const handleViewMeal = (mealId) => {
    navigate(`/dashboard/potlucky/browse/${mealId}`);
  };

  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    cuisine: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    deliveryTime: ''
  });

  const cuisineTypes = ['All', 'Ghanaian', 'West African', 'Nigerian', 'Ivorian', 'African'];
  const locations = ['All', 'East Legon, Accra', 'Tema, Accra', 'Kumasi', 'Takoradi', 'Tamale', 'Lapaz, Accra', 'Madina, Accra'];
  const priceRanges = [
    { label: 'All', min: '', max: '' },
    { label: 'Under ¢20', min: '', max: '20' },
    { label: '¢20-¢30', min: '20', max: '30' },
    { label: '¢30-¢40', min: '30', max: '40' },
    { label: 'Over ¢40', min: '40', max: '' }
  ];

  // Transform API data to match component expectations
  // Replace your transformMealData function in Browse.jsx with this:
const transformMealData = (apiMeal) => {
  // Safely handle createdBy which can be null
  let chefName = 'Unknown Chef';
  if (apiMeal.createdBy && apiMeal.createdBy.firstName) {
    chefName = `${apiMeal.createdBy.firstName} ${apiMeal.createdBy.lastName || ''}`.trim();
  }

  return {
    id: apiMeal.id,
    name: apiMeal.mealName,
    description: apiMeal.description,
    price: apiMeal.price,
    cuisine: apiMeal.cuisine,
    location: apiMeal.pickupLocation,
    rating: apiMeal.averageRating || 0,
    reviewCount: apiMeal.reviewCount || 0,
    available: apiMeal.status === 'Available',
    deliveryTime: `${apiMeal.cookingTime} mins`,
    image: apiMeal.photos && apiMeal.photos.length > 0 
      ? apiMeal.photos[0] 
      : 'https://nyonyogh.com/wp-content/uploads/2024/01/d19188f6dcc876c7181db2797e951b70-540x440.jpg',
    chef: {
      name: chefName,
      rating: 4.5
    },
    tags: [
      apiMeal.category,
      apiMeal.spiceLevel,
      ...(apiMeal.dietaryRestrictions || []),
      `${apiMeal.servings} serving${apiMeal.servings > 1 ? 's' : ''}`
    ].filter(Boolean),
    fullMealData: apiMeal
  };
};

  // Fetch meals from API
  // Update your fetchMeals useEffect in Browse.jsx
useEffect(() => {
  const fetchMeals = async () => {
    try {
      const response = await apiGetAllMeals();
      console.log('Raw meals data:', response);
      
      // Filter out non-available meals and transform
      const availableMeals = response.filter(meal => meal.status === 'Available');
      console.log('Available meals:', availableMeals.length, 'out of', response.length);
      
      const transformedMeals = availableMeals.map(transformMealData);
      console.log('Transformed meals:', transformedMeals);
      
      setMeals(transformedMeals);
      setFilteredMeals(transformedMeals);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      // Set empty state on error to prevent infinite loading
      setMeals([]);
      setFilteredMeals([]);
    } finally {
      setLoading(false);
    }
  };

  fetchMeals();
}, []);

  useEffect(() => {
    filterMeals();
  }, [searchTerm, filters, meals]);

  const filterMeals = () => {
    let filtered = meals;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(meal => 
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.chef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (filters.location && filters.location !== 'All') {
      filtered = filtered.filter(meal => meal.location === filters.location);
    }

    // Cuisine filter
    if (filters.cuisine && filters.cuisine !== 'All') {
      filtered = filtered.filter(meal => meal.cuisine === filters.cuisine);
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(meal => meal.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(meal => meal.price <= parseFloat(filters.maxPrice));
    }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter(meal => meal.rating >= parseFloat(filters.rating));
    }

    setFilteredMeals(filtered);
  };

  const handleToggleFavorite = async (mealId, event) => {
    event.stopPropagation();
    await toggleFavorite(mealId);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      cuisine: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      deliveryTime: ''
    });
    setSearchTerm('');
  };

  const applyPriceRange = (range) => {
    setFilters(prev => ({
      ...prev,
      minPrice: range.min,
      maxPrice: range.max
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Search Section */}
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-900">Order your favourite food!</h1>
            {/* <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {filteredMeals.length} meals
            </div> */}
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-gray-100 rounded-full border-0 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {cuisineTypes.slice(0, 5).map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setFilters(prev => ({ ...prev, cuisine: cuisine === 'All' ? '' : cuisine }))}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.cuisine === cuisine || (cuisine === 'All' && !filters.cuisine)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] rounded-t-3xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location} value={location === 'All' ? '' : location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cuisine Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Cuisine</label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {cuisineTypes.map(cuisine => (
                    <option key={cuisine} value={cuisine === 'All' ? '' : cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  {priceRanges.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => applyPriceRange(range)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        filters.minPrice === range.min && filters.maxPrice === range.max
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                onClick={clearFilters}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meals Grid */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {filteredMeals.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meals found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filters to find what you're looking for
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredMeals.map((meal) => (
                <div
                  key={meal.id}
                  onClick={() => handleViewMeal(meal.id)}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-md"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://nyonyogh.com/wp-content/uploads/2024/01/d19188f6dcc876c7181db2797e951b70-540x440.jpg';
                      }}
                    />
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleToggleFavorite(meal.id, e)}
                      className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all ${
                        isFavorite(meal.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(meal.id) ? 'fill-current' : ''}`} />
                    </button>
                    
                    {/* Availability Badge */}
                    {!meal.available && (
                      <div className="absolute top-3 left-3 bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Unavailable
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                      {meal.name}
                    </h3>
                    
                    {/* Chef Info */}
                    <div className="flex items-center space-x-1 mb-2">
                      <ChefHat className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600 truncate">{meal.chef.name}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {meal.rating || 'New'}
                      </span>
                      {meal.reviewCount > 0 && (
                        <span className="text-xs text-gray-500">({meal.reviewCount})</span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-lg font-bold text-red-500">¢{meal.price}</span>
                      </div>
                      
                      {/* Delivery Time */}
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{meal.deliveryTime}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-1 mt-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 truncate">{meal.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;