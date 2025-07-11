// 📁 src/components/roles/FranchiseeDashboard.jsx
import React from 'react';
import { Bell, User, Settings, LogOut, Home, ChefHat, ShoppingCart, Heart, Search, CheckCircle, BarChart3, Users, Package } from 'lucide-react';



const FranchiseeDashboard = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Welcome, Franchisee!</h2>
      <p className="text-gray-600">Monitor your franchise operations.</p>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending Approvals</p>
            <p className="text-2xl font-bold">3</p>
          </div>
          <CheckCircle className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Chefs</p>
            <p className="text-2xl font-bold">15</p>
          </div>
          <Users className="w-8 h-8 text-purple-500" />
        </div>
      </div>
    </div>
  </div>
);
export default FranchiseeDashboard;