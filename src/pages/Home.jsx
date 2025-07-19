import React from "react";
import {
  ChefHat,
  Users,
  MapPin,
  Star,
  Utensils,
  Home,
  Store,
} from "lucide-react";
import heroImage from "../assets/images/potluck-home.png";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          {/* Food Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-orange-800 via-amber-700 to-yellow-600"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-wide">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Potluck
              </span>
            </h1> */}

            <p className="text-xl md:text-2xl text-white mb-4 font-medium">
              Connecting Ghanaian communities through homemade meals.
            </p>

            <p className="text-lg md:text-xl text-white mb-12 font-light">
              Where neighbors become family, one dish at a time.
            </p>

            <div className="flex justify-center">
              <Link to="/login">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h2>
            <p className="text-lg text-gray-600">
              Choose your role in the Potluck experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Potlucky - Food Lover */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <div className="p-8 text-center">
                <div className="bg-orange-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Utensils className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Potlucky
                </h3>
                <p className="text-gray-600 font-medium mb-4">Food Lover</p>
                <p className="text-gray-700 mb-6">
                  Discover and order delicious homemade meals from local cooks
                  in your area
                </p>
                <ul className="text-left text-gray-600 space-y-2 mb-8">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Browse local menus</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Real-time delivery tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Rate and review meals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Save favorites</span>
                  </li>
                </ul>
                <Link to="/signup">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300">
                    Join as Potlucky
                  </button>
                </Link>
              </div>
            </div>

            {/* Potchef - Home Cook & Vendor */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <div className="p-8 text-center">
                <div className="bg-orange-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <ChefHat className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Potchef
                </h3>
                <p className="text-gray-600 font-medium mb-4">
                  Home Cook & Vendor
                </p>
                <p className="text-gray-700 mb-6">
                  Share your culinary passion and earn income by cooking for
                  your community
                </p>
                <ul className="text-left text-gray-600 space-y-2 mb-8">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Upload your recipes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Set your own prices</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Flexible cooking schedule</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Build your reputation</span>
                  </li>
                </ul>
                <Link to="/signup">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300">
                    Join as Potchef
                  </button>
                </Link>
              </div>
            </div>

            {/* Franchisee - Dine-in Operator */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <div className="p-8 text-center">
                <div className="bg-orange-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Store className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Franchisee
                </h3>
                <p className="text-gray-600 font-medium mb-4">
                  Dine-in Operator
                </p>
                <p className="text-gray-700 mb-6">
                  Operate a local Potluck location and serve fresh meals to
                  customers
                </p>
                <ul className="text-left text-gray-600 space-y-2 mb-8">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Manage local operations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Coordinate with Potchefs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Serve dine-in customers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Track performance</span>
                  </li>
                </ul>
                <Link to="/signup">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300">
                    Join as Franchisee
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
