import React, { useEffect, useState } from 'react';
import {
  ChefHat,
  ShoppingCart,
} from 'lucide-react';
import { apiGetChefsMeals, apiGetChefOrders } from '../../services/potchef';

const PotchefDashboard = () => {
  const [totalMeals, setTotalMeals] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch meals
        const mealsData = await apiGetChefsMeals();
        setTotalMeals(mealsData.count);

        // Fetch orders and filter those placed today
        const orderData = await apiGetChefOrders();
        const today = new Date().toISOString().split('T')[0];

        const todayCount = orderData.orders?.filter(order => {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === today;
        }).length || 0;

        setTodayOrders(todayCount);
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
        <p className="text-gray-600">Manage your meals and orders from here.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      )}
    </div>
  );
};

export default PotchefDashboard;
