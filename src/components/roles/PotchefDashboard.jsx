// 📁 src/components/roles/PotchefDashboard.jsx
import React from 'react';
import { Bell, User, Settings, LogOut, Home, ChefHat, ShoppingCart, Heart, Search, CheckCircle, BarChart3, Users, Package } from 'lucide-react';

const PotchefDashboard = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Welcome, Potchef!</h2>
      <p className="text-gray-600">Manage your meals and orders from here.</p>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Meals</p>
            <p className="text-2xl font-bold">24</p>
          </div>
          <ChefHat className="w-8 h-8 text-orange-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Orders Today</p>
            <p className="text-2xl font-bold">8</p>
          </div>
          <ShoppingCart className="w-8 h-8 text-green-500" />
        </div>
      </div>
    </div>
  </div>
);

export default PotchefDashboard;