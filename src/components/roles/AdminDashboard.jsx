// 📁 src/components/roles/AdminDashboard.jsx
import React from 'react';
import { Bell, User, Settings, LogOut, Home, ChefHat, ShoppingCart, Heart, Search, CheckCircle, BarChart3, Users, Package } from 'lucide-react';



const AdminDashboard = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Welcome, Admin!</h2>
      <p className="text-gray-600">System overview and management.</p>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <Users className="w-8 h-8 text-indigo-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-2xl font-bold">$25k</p>
          </div>
          <BarChart3 className="w-8 h-8 text-green-500" />
        </div>
      </div>
    </div>
  </div>
);


export default AdminDashboard;