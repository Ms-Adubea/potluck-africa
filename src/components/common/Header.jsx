// 📁 src/components/common/Header.jsx
import React, { useState } from "react";
import {
  Bell,
  User,
  Settings,
  LogOut,
  Home,
  ChefHat,
  ShoppingCart,
  Heart,
  Search,
  CheckCircle,
  BarChart3,
  Users,
  Package,
} from "lucide-react";
import navigationConfig from "../../constants/navigationConfig";
import { Link } from "react-router-dom";

// Header Component with Profile Dropdown
const Header = ({ currentRole, setCurrentRole }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const config = navigationConfig[currentRole];

  return (
    <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center relative">
      <div className="flex items-center space-x-2">
        <span>{config.avatar}</span>
        {/* <h1 className="font-semibold text-xl">Potluck</h1> */}
        <Link to="/">
        <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text font-semibold text-xl text-transparent">
          Potluck
        </span>
        </Link>
      </div>

      <div className="flex space-x-4 items-center">
        <Bell className="w-5 h-5 text-gray-500" />
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white relative"
        >
          U
        </button>

        {/* Profile Dropdown */}
        {isProfileOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsProfileOpen(false)}
            />
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border z-20">
              <div className="p-4 border-b">
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-600 capitalize">
                  {currentRole}
                </p>
              </div>
              <div className="py-2">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Handle profile navigation
                  }}
                  className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50"
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Handle settings navigation
                  }}
                  className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
                <div className="border-t my-2"></div>
                <div className="px-4 py-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Switch Role
                  </label>
                  <select
                    value={currentRole}
                    onChange={(e) => {
                      setCurrentRole(e.target.value);
                      setIsProfileOpen(false);
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="potchef">Potchef</option>
                    <option value="potlucky">Potlucky</option>
                    <option value="franchisee">Franchisee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="border-t my-2"></div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Handle logout
                  }}
                  className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
