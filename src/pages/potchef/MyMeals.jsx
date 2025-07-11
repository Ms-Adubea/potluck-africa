// import React, { useState } from 'react';
// import { Search, Eye, EyeOff, Star, MapPin, Edit, ArrowLeft, Calendar, Clock, DollarSign, Users, ChefHat } from 'lucide-react';

// const MyMeals = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [selectedMeal, setSelectedMeal] = useState(null);
  
//   // Sample meals data
//   const [meals, setMeals] = useState([
//     {
//       id: 1,
//       name: "Jollof Rice with Grilled Chicken",
//       price: 25.00,
//       image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
//       description: "Perfectly seasoned jollof rice served with tender grilled chicken and plantain. This authentic West African dish combines aromatic spices with perfectly cooked rice and tender, juicy chicken that's been marinated in a blend of traditional spices.",
//       category: "Main Course",
//       prepTime: "30 mins",
//       cookTime: "45 mins",
//       servings: 2,
//       rating: 4.8,
//       reviewCount: 24,
//       isAvailable: true,
//       location: "Accra, Ghana",
//       createdAt: "2024-01-15",
//       ingredients: ["Basmati rice", "Chicken breast", "Tomatoes", "Onions", "Bell peppers", "Plantain", "Curry powder", "Thyme", "Bay leaves"],
//       allergens: ["None"],
//       nutritionInfo: {
//         calories: 450,
//         protein: "28g",
//         carbs: "52g",
//         fat: "12g"
//       }
//     },
//     {
//       id: 2,
//       name: "Kelewele with Groundnut Soup",
//       price: 15.00,
//       image: "https://images.unsplash.com/photo-1596040767493-75c5c2e5d355?w=400&h=300&fit=crop",
//       description: "Spicy fried plantain cubes served with rich groundnut soup. A traditional Ghanaian comfort food that combines sweet plantains with aromatic spices and a creamy peanut-based soup.",
//       category: "Traditional",
//       prepTime: "20 mins",
//       cookTime: "45 mins",
//       servings: 1,
//       rating: 4.6,
//       reviewCount: 18,
//       isAvailable: false,
//       location: "Kumasi, Ghana",
//       createdAt: "2024-01-10",
//       ingredients: ["Ripe plantain", "Groundnuts", "Ginger", "Garlic", "Chili pepper", "Onions", "Tomatoes", "Palm oil"],
//       allergens: ["Peanuts"],
//       nutritionInfo: {
//         calories: 380,
//         protein: "12g",
//         carbs: "45g",
//         fat: "18g"
//       }
//     },
//     {
//       id: 3,
//       name: "Banku with Tilapia",
//       price: 20.00,
//       image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
//       description: "Fresh tilapia grilled to perfection served with banku and spicy pepper sauce. A coastal favorite that showcases the best of Ghanaian seafood cuisine.",
//       category: "Seafood",
//       prepTime: "15 mins",
//       cookTime: "25 mins",
//       servings: 1,
//       rating: 4.9,
//       reviewCount: 32,
//       isAvailable: true,
//       location: "Tema, Ghana",
//       createdAt: "2024-01-12",
//       ingredients: ["Fresh tilapia", "Corn flour", "Cassava flour", "Tomatoes", "Onions", "Scotch bonnet pepper", "Garlic", "Ginger"],
//       allergens: ["Fish"],
//       nutritionInfo: {
//         calories: 350,
//         protein: "32g",
//         carbs: "28g",
//         fat: "10g"
//       }
//     },
//     {
//       id: 4,
//       name: "Waakye with Stew",
//       price: 12.00,
//       image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
//       description: "Traditional waakye with beef stew, boiled egg, and gari. A hearty breakfast or lunch option that's beloved across Ghana.",
//       category: "Traditional",
//       prepTime: "10 mins",
//       cookTime: "40 mins",
//       servings: 1,
//       rating: 4.7,
//       reviewCount: 15,
//       isAvailable: true,
//       location: "Accra, Ghana",
//       createdAt: "2024-01-08",
//       ingredients: ["Rice", "Black-eyed peas", "Beef", "Tomatoes", "Onions", "Eggs", "Gari", "Millet leaves"],
//       allergens: ["Eggs"],
//       nutritionInfo: {
//         calories: 420,
//         protein: "25g",
//         carbs: "48g",
//         fat: "14g"
//       }
//     },
//     {
//       id: 5,
//       name: "Red Red with Plantain",
//       price: 10.00,
//       image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
//       description: "Delicious red red (bean stew) served with fried plantain. A popular street food that's both nutritious and satisfying.",
//       category: "Traditional",
//       prepTime: "15 mins",
//       cookTime: "35 mins",
//       servings: 1,
//       rating: 4.4,
//       reviewCount: 12,
//       isAvailable: true,
//       location: "Kumasi, Ghana",
//       createdAt: "2024-01-03",
//       ingredients: ["Black-eyed peas", "Palm oil", "Plantain", "Onions", "Tomatoes", "Ginger", "Garlic", "Smoked fish"],
//       allergens: ["Fish"],
//       nutritionInfo: {
//         calories: 320,
//         protein: "15g",
//         carbs: "42g",
//         fat: "12g"
//       }
//     }
//   ]);

//   const toggleAvailability = (mealId) => {
//     setMeals(prevMeals =>
//       prevMeals.map(meal =>
//         meal.id === mealId ? { ...meal, isAvailable: !meal.isAvailable } : meal
//       )
//     );
//   };

//   const filteredMeals = meals.filter(meal => {
//     const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          meal.category.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === 'all' || 
//                          (filterStatus === 'available' && meal.isAvailable) ||
//                          (filterStatus === 'unavailable' && !meal.isAvailable);
//     return matchesSearch && matchesStatus;
//   });

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Meal Detail View Component
//   const MealDetailView = ({ meal, onBack, onEdit }) => (
//     <div className="bg-white min-h-screen">
//       {/* Header */}
//       <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
//         <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
//           <ArrowLeft className="w-5 h-5" />
//         </button>
//         <h1 className="font-semibold text-lg">Meal Details</h1>
//         <button onClick={onEdit} className="p-2 hover:bg-gray-100 rounded-full">
//           <Edit className="w-5 h-5 text-orange-600" />
//         </button>
//       </div>

//       {/* Image */}
//       <div className="relative">
//         <img 
//           src={meal.image} 
//           alt={meal.name}
//           className="w-full h-64 object-cover"
//         />
//         <div className="absolute top-4 right-4">
//           <button
//             onClick={() => toggleAvailability(meal.id)}
//             className={`p-3 rounded-full ${meal.isAvailable ? 'bg-green-500' : 'bg-gray-500'} text-white shadow-lg`}
//           >
//             {meal.isAvailable ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
//           </button>
//         </div>
//         <div className="absolute bottom-4 left-4">
//           <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//             meal.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//           }`}>
//             {meal.isAvailable ? 'Available' : 'Unavailable'}
//           </span>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-4 space-y-6">
//         {/* Basic Info */}
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">{meal.name}</h2>
//           <div className="flex items-center justify-between mb-3">
//             <span className="text-2xl font-bold text-orange-600">${meal.price}</span>
//             <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{meal.category}</span>
//           </div>
//           <p className="text-gray-600 leading-relaxed">{meal.description}</p>
//         </div>

//         {/* Rating & Location */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <Star className="w-5 h-5 fill-current text-yellow-400 mr-1" />
//             <span className="font-semibold">{meal.rating}</span>
//             <span className="text-gray-500 ml-1">({meal.reviewCount} reviews)</span>
//           </div>
//           <div className="flex items-center text-gray-600">
//             <MapPin className="w-4 h-4 mr-1" />
//             <span className="text-sm">{meal.location}</span>
//           </div>
//         </div>

//         {/* Time & Servings */}
//         <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
//           <div className="text-center">
//             <Clock className="w-5 h-5 mx-auto mb-1 text-gray-500" />
//             <p className="text-xs text-gray-500">Prep Time</p>
//             <p className="font-semibold">{meal.prepTime}</p>
//           </div>
//           <div className="text-center">
//             <ChefHat className="w-5 h-5 mx-auto mb-1 text-gray-500" />
//             <p className="text-xs text-gray-500">Cook Time</p>
//             <p className="font-semibold">{meal.cookTime}</p>
//           </div>
//           <div className="text-center">
//             <Users className="w-5 h-5 mx-auto mb-1 text-gray-500" />
//             <p className="text-xs text-gray-500">Servings</p>
//             <p className="font-semibold">{meal.servings}</p>
//           </div>
//         </div>

//         {/* Ingredients */}
//         <div>
//           <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
//           <div className="grid grid-cols-2 gap-2">
//             {meal.ingredients.map((ingredient, index) => (
//               <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
//                 <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
//                 <span className="text-sm">{ingredient}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Nutrition Info */}
//         <div>
//           <h3 className="font-semibold text-lg mb-3">Nutrition Information</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="p-3 bg-gray-50 rounded-lg text-center">
//               <p className="text-sm text-gray-500">Calories</p>
//               <p className="font-bold text-lg">{meal.nutritionInfo.calories}</p>
//             </div>
//             <div className="p-3 bg-gray-50 rounded-lg text-center">
//               <p className="text-sm text-gray-500">Protein</p>
//               <p className="font-bold text-lg">{meal.nutritionInfo.protein}</p>
//             </div>
//             <div className="p-3 bg-gray-50 rounded-lg text-center">
//               <p className="text-sm text-gray-500">Carbs</p>
//               <p className="font-bold text-lg">{meal.nutritionInfo.carbs}</p>
//             </div>
//             <div className="p-3 bg-gray-50 rounded-lg text-center">
//               <p className="text-sm text-gray-500">Fat</p>
//               <p className="font-bold text-lg">{meal.nutritionInfo.fat}</p>
//             </div>
//           </div>
//         </div>

//         {/* Allergens */}
//         <div>
//           <h3 className="font-semibold text-lg mb-3">Allergens</h3>
//           <div className="flex flex-wrap gap-2">
//             {meal.allergens.map((allergen, index) => (
//               <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
//                 {allergen}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Created Date */}
//         <div className="flex items-center text-gray-500 text-sm">
//           <Calendar className="w-4 h-4 mr-2" />
//           <span>Created on {formatDate(meal.createdAt)}</span>
//         </div>
//       </div>
//     </div>
//   );

//   // Main List View
//   if (selectedMeal) {
//     return (
//       <MealDetailView 
//         meal={selectedMeal} 
//         onBack={() => setSelectedMeal(null)}
//         onEdit={() => {/* Handle edit */}}
//       />
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="bg-white p-4 border-b border-gray-200">
//         <h1 className="text-xl font-bold text-gray-900 mb-4">My Meals</h1>
        
//         {/* Search */}
//         <div className="relative mb-4">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <input
//             type="text"
//             placeholder="Search meals..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//           />
//         </div>

//         {/* Filter */}
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//         >
//           <option value="all">All Status</option>
//           <option value="available">Available</option>
//           <option value="unavailable">Unavailable</option>
//         </select>
//       </div>

//       {/* Stats */}
//       <div className="p-4 bg-white border-b border-gray-200">
//         <div className="grid grid-cols-3 gap-4">
//           <div className="text-center">
//             <div className="text-lg font-bold text-gray-900">{meals.length}</div>
//             <div className="text-sm text-gray-500">Total</div>
//           </div>
//           <div className="text-center">
//             <div className="text-lg font-bold text-green-600">{meals.filter(m => m.isAvailable).length}</div>
//             <div className="text-sm text-gray-500">Available</div>
//           </div>
//           <div className="text-center">
//             <div className="text-lg font-bold text-red-600">{meals.filter(m => !m.isAvailable).length}</div>
//             <div className="text-sm text-gray-500">Unavailable</div>
//           </div>
//         </div>
//       </div>

//       {/* Meals List */}
//       <div className="p-4 space-y-4">
//         {filteredMeals.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-lg mb-2">No meals found</div>
//             <p className="text-gray-600">Try adjusting your search or filters</p>
//           </div>
//         ) : (
//           filteredMeals.map(meal => (
//             <div key={meal.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
//               <div className="p-4">
//                 <div className="flex gap-4">
//                   <div className="relative">
//                     <img 
//                       src={meal.image} 
//                       alt={meal.name}
//                       className="w-20 h-20 object-cover rounded-lg"
//                     />
//                     <button
//                       onClick={() => toggleAvailability(meal.id)}
//                       className={`absolute -top-2 -right-2 p-1 rounded-full ${
//                         meal.isAvailable ? 'bg-green-500' : 'bg-gray-500'
//                       } text-white shadow-sm`}
//                     >
//                       {meal.isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
//                     </button>
//                   </div>
                  
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-semibold text-gray-900 truncate pr-2">{meal.name}</h3>
//                       <span className="text-lg font-bold text-orange-600 whitespace-nowrap">${meal.price}</span>
//                     </div>
                    
//                     <div className="flex items-center text-sm text-gray-500 mb-2">
//                       <MapPin className="w-3 h-3 mr-1" />
//                       <span className="truncate">{meal.location}</span>
//                     </div>
                    
//                     <div className="flex items-center justify-between text-sm">
//                       <div className="flex items-center">
//                         <Star className="w-4 h-4 fill-current text-yellow-400 mr-1" />
//                         <span className="font-medium">{meal.rating}</span>
//                         <span className="text-gray-500 ml-1">({meal.reviewCount})</span>
//                       </div>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         meal.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {meal.isAvailable ? 'Available' : 'Unavailable'}
//                       </span>
//                     </div>
                    
//                     <div className="flex items-center justify-between mt-2">
//                       <div className="flex items-center text-xs text-gray-500">
//                         <Calendar className="w-3 h-3 mr-1" />
//                         <span>{formatDate(meal.createdAt)}</span>
//                       </div>
//                       <button 
//                         onClick={() => setSelectedMeal(meal)}
//                         className="text-orange-600 text-sm font-medium hover:text-orange-700"
//                       >
//                         View Details
//                       </button>
//                     </div>
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

// export default MyMeals;

// src/pages/MyMeals.jsx
import React, { useState } from 'react';
import { Search, Eye, EyeOff, Star, MapPin, Calendar } from 'lucide-react';
import MealDetailView from './MealDeatailView';
import EditMeal from './EditMeal';


const MyMeals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);

   // Sample meals data
  const [meals, setMeals] = useState([
    {
      id: 1,
      name: "Jollof Rice with Grilled Chicken",
      price: 25.00,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
      description: "Perfectly seasoned jollof rice served with tender grilled chicken and plantain. This authentic West African dish combines aromatic spices with perfectly cooked rice and tender, juicy chicken that's been marinated in a blend of traditional spices.",
      category: "Main Course",
      prepTime: "30 mins",
      cookTime: "45 mins",
      servings: 2,
      rating: 4.8,
      reviewCount: 24,
      isAvailable: true,
      location: "Accra, Ghana",
      createdAt: "2024-01-15",
      ingredients: ["Basmati rice", "Chicken breast", "Tomatoes", "Onions", "Bell peppers", "Plantain", "Curry powder", "Thyme", "Bay leaves"],
      allergens: ["None"],
      nutritionInfo: {
        calories: 450,
        protein: "28g",
        carbs: "52g",
        fat: "12g"
      }
    },
    {
      id: 2,
      name: "Kelewele with Groundnut Soup",
      price: 15.00,
      image: "https://images.unsplash.com/photo-1596040767493-75c5c2e5d355?w=400&h=300&fit=crop",
      description: "Spicy fried plantain cubes served with rich groundnut soup. A traditional Ghanaian comfort food that combines sweet plantains with aromatic spices and a creamy peanut-based soup.",
      category: "Traditional",
      prepTime: "20 mins",
      cookTime: "45 mins",
      servings: 1,
      rating: 4.6,
      reviewCount: 18,
      isAvailable: false,
      location: "Kumasi, Ghana",
      createdAt: "2024-01-10",
      ingredients: ["Ripe plantain", "Groundnuts", "Ginger", "Garlic", "Chili pepper", "Onions", "Tomatoes", "Palm oil"],
      allergens: ["Peanuts"],
      nutritionInfo: {
        calories: 380,
        protein: "12g",
        carbs: "45g",
        fat: "18g"
      }
    },
    {
      id: 3,
      name: "Banku with Tilapia",
      price: 20.00,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      description: "Fresh tilapia grilled to perfection served with banku and spicy pepper sauce. A coastal favorite that showcases the best of Ghanaian seafood cuisine.",
      category: "Seafood",
      prepTime: "15 mins",
      cookTime: "25 mins",
      servings: 1,
      rating: 4.9,
      reviewCount: 32,
      isAvailable: true,
      location: "Tema, Ghana",
      createdAt: "2024-01-12",
      ingredients: ["Fresh tilapia", "Corn flour", "Cassava flour", "Tomatoes", "Onions", "Scotch bonnet pepper", "Garlic", "Ginger"],
      allergens: ["Fish"],
      nutritionInfo: {
        calories: 350,
        protein: "32g",
        carbs: "28g",
        fat: "10g"
      }
    },
    {
      id: 4,
      name: "Waakye with Stew",
      price: 12.00,
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      description: "Traditional waakye with beef stew, boiled egg, and gari. A hearty breakfast or lunch option that's beloved across Ghana.",
      category: "Traditional",
      prepTime: "10 mins",
      cookTime: "40 mins",
      servings: 1,
      rating: 4.7,
      reviewCount: 15,
      isAvailable: true,
      location: "Accra, Ghana",
      createdAt: "2024-01-08",
      ingredients: ["Rice", "Black-eyed peas", "Beef", "Tomatoes", "Onions", "Eggs", "Gari", "Millet leaves"],
      allergens: ["Eggs"],
      nutritionInfo: {
        calories: 420,
        protein: "25g",
        carbs: "48g",
        fat: "14g"
      }
    },
    {
      id: 5,
      name: "Red Red with Plantain",
      price: 10.00,
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
      description: "Delicious red red (bean stew) served with fried plantain. A popular street food that's both nutritious and satisfying.",
      category: "Traditional",
      prepTime: "15 mins",
      cookTime: "35 mins",
      servings: 1,
      rating: 4.4,
      reviewCount: 12,
      isAvailable: true,
      location: "Kumasi, Ghana",
      createdAt: "2024-01-03",
      ingredients: ["Black-eyed peas", "Palm oil", "Plantain", "Onions", "Tomatoes", "Ginger", "Garlic", "Smoked fish"],
      allergens: ["Fish"],
      nutritionInfo: {
        calories: 320,
        protein: "15g",
        carbs: "42g",
        fat: "12g"
      }
    }
  ]);

  // Add this function to handle saving edits
const handleSaveEdit = (updatedMeal) => {
  setMeals(prevMeals =>
    prevMeals.map(meal =>
      meal.id === updatedMeal.id ? updatedMeal : meal
    )
  );
  setEditingMeal(null);
  setSelectedMeal(updatedMeal);
};


  const toggleAvailability = (mealId) => {
    setMeals(prevMeals =>
      prevMeals.map(meal =>
        meal.id === mealId ? { ...meal, isAvailable: !meal.isAvailable } : meal
      )
    );
  };

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'available' && meal.isAvailable) ||
                         (filterStatus === 'unavailable' && !meal.isAvailable);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (editingMeal) {
  return (
    <EditMeal
      meal={editingMeal}
      onSave={handleSaveEdit}
      onCancel={() => setEditingMeal(null)}
    />
  );
}

  if (selectedMeal) {
    return (
      <MealDetailView 
        meal={selectedMeal}
        onBack={() => setSelectedMeal(null)}
        onEdit={(meal) => setEditingMeal(meal)}
        onToggleAvailability={toggleAvailability}
      />
    );
  }

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
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {/* Stats */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{meals.length}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{meals.filter(m => m.isAvailable).length}</div>
            <div className="text-sm text-gray-500">Available</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{meals.filter(m => !m.isAvailable).length}</div>
            <div className="text-sm text-gray-500">Unavailable</div>
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div className="p-4 space-y-4">
        {filteredMeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No meals found</div>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredMeals.map(meal => (
            <div key={meal.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4">
                <div className="flex gap-4">
                  <div className="relative">
                    <img 
                      src={meal.image} 
                      alt={meal.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => toggleAvailability(meal.id)}
                      className={`absolute -top-2 -right-2 p-1 rounded-full ${
                        meal.isAvailable ? 'bg-green-500' : 'bg-gray-500'
                      } text-white shadow-sm`}
                    >
                      {meal.isAvailable ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 truncate pr-2">{meal.name}</h3>
                      <span className="text-lg font-bold text-orange-600 whitespace-nowrap">${meal.price}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{meal.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-current text-yellow-400 mr-1" />
                        <span className="font-medium">{meal.rating}</span>
                        <span className="text-gray-500 ml-1">({meal.reviewCount})</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        meal.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {meal.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(meal.createdAt)}</span>
                      </div>
                      <button 
                        onClick={() => setSelectedMeal(meal)}
                        className="text-orange-600 text-sm font-medium hover:text-orange-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyMeals;