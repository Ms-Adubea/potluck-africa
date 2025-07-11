// 📁 src/components/roles/PotluckyDashboard.jsx
import React from 'react';
import { Bell, User, Settings, LogOut, Home, ChefHat, ShoppingCart, Heart, Search, CheckCircle, BarChart3, Users, Package } from 'lucide-react';



const PotluckyDashboard = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Welcome, Potlucky!</h2>
      <p className="text-gray-600">Discover amazing meals near you.</p>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Orders</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <ShoppingCart className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Favorites</p>
            <p className="text-2xl font-bold">5</p>
          </div>
          <Heart className="w-8 h-8 text-red-500" />
        </div>
      </div>
    </div>
  </div>
);

export default PotluckyDashboard;