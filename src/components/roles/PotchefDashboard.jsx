// import React, { useEffect, useState } from 'react';
// import {
//   ChefHat,
//   ShoppingCart,
// } from 'lucide-react';
// import { apiGetChefsMeals, apiGetChefOrders } from '../../services/potchef';

// const PotchefDashboard = () => {
//   const [totalMeals, setTotalMeals] = useState(0);
//   const [todayOrders, setTodayOrders] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         // Fetch meals
//         const mealsData = await apiGetChefsMeals();
//         setTotalMeals(mealsData.count);

//         // Fetch orders and filter those placed today
//         const orderData = await apiGetChefOrders();
//         const today = new Date().toISOString().split('T')[0];

//         const todayCount = orderData.orders?.filter(order => {
//           const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
//           return orderDate === today;
//         }).length || 0;

//         setTodayOrders(todayCount);
//       } catch (error) {
//         console.error('Error loading dashboard stats:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-lg font-semibold mb-2">Welcome, Potchef!</h2>
//         <p className="text-gray-600">Manage your meals and orders from here.</p>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-32">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-white rounded-lg shadow p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Meals</p>
//                 <p className="text-2xl font-bold">{totalMeals}</p>
//               </div>
//               <ChefHat className="w-8 h-8 text-orange-500" />
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Orders Today</p>
//                 <p className="text-2xl font-bold">{todayOrders}</p>
//               </div>
//               <ShoppingCart className="w-8 h-8 text-green-500" />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PotchefDashboard;


import React, { useEffect, useState } from 'react';
import {
  ChefHat,
  ShoppingCart,
  BarChart3,
  CircleDollarSign,
  Flame,
} from 'lucide-react';
import { apiGetChefsMeals, apiGetChefOrders } from '../../services/potchef';

const PotchefDashboard = () => {
  const [totalMeals, setTotalMeals] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [totalRevenueToday, setTotalRevenueToday] = useState(0);
  const [bestSellingMeals, setBestSellingMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Total Meals
        const mealsData = await apiGetChefsMeals();
        setTotalMeals(mealsData.count);

        // 2. Fetch All Orders
        let allOrders = [];
        let page = 1;
        let totalPages = 1;

        while (page <= totalPages) {
          const data = await apiGetChefOrders(page);
          totalPages = data.totalPages || 1;
          allOrders = [...allOrders, ...(data.orders || [])];
          page++;
        }

        // 3. Today's Date
        const today = new Date().toISOString().split('T')[0];

        // 4. Filter Today's Orders
        const todayOrdersList = allOrders.filter(order => {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === today;
        });

        setTodayOrders(todayOrdersList.length);

        // 5. Total Revenue Today
        const revenue = todayOrdersList.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        setTotalRevenueToday(revenue);

        // 6. Best-Selling Meals (grouped by meal name)
        const mealSales = {};
        allOrders.forEach(order => {
          const meal = order.meal?.name || order.mealName || 'Unknown';
          if (!mealSales[meal]) mealSales[meal] = 0;
          mealSales[meal] += order.quantity || 0;
        });

        const topMeals = Object.entries(mealSales)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, quantity]) => ({ name, quantity }));

        setBestSellingMeals(topMeals);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Welcome, Potchef!</h2>
        <p className="text-gray-600">Manage your meals and monitor your performance.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Meals</p>
                  <p className="text-2xl font-bold">{totalMeals}</p>
                </div>
                <ChefHat className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Orders Today</p>
                  <p className="text-2xl font-bold">{todayOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue Today</p>
                  <p className="text-2xl font-bold text-green-700">
                    ¢{totalRevenueToday.toFixed(2)}
                  </p>
                </div>
                <CircleDollarSign className="w-8 h-8 text-green-700" />
              </div>
            </div>
          </div>

          {/* Top Meals */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-gray-800">🔥 Top 5 Best-Selling Meals</h3>
              <BarChart3 className="w-6 h-6 text-orange-500" />
            </div>
            {bestSellingMeals.length === 0 ? (
              <p className="text-sm text-gray-500">No orders yet.</p>
            ) : (
              <ul className="space-y-2">
                {bestSellingMeals.map((meal, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{meal.name}</span>
                    <span className="text-sm bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                      {meal.quantity} sold
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PotchefDashboard;
