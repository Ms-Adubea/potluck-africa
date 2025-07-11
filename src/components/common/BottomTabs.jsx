// 📁 src/components/common/BottomTabs.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ChefHat, ShoppingCart, Heart, Search, CheckCircle, BarChart3, Users, Package, Plus } from 'lucide-react';
import navigationConfig from '../../constants/navigationConfig';

const iconMap = {
  Home,
  ChefHat,
  ShoppingCart,
  Heart,
  Search,
  CheckCircle,
  BarChart3,
  Users,
  Package,
  Plus
};

const BottomTabs = ({ currentRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const config = navigationConfig[currentRole];
  
  const handleTabClick = (tabId) => {
    if (tabId === 'dashboard') {
      navigate(`/dashboard/${currentRole}`);
    } else {
      navigate(`/dashboard/${currentRole}/${tabId}`);
    }
  };

  const isActive = (tabId) => {
    const currentPath = location.pathname;
    if (tabId === 'dashboard') {
      return currentPath === `/dashboard/${currentRole}`;
    }
    return currentPath.includes(`/${tabId}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2">
      {config.navigation.map((item) => {
        const IconComponent = iconMap[item.icon];
        const active = isActive(item.id);
        
        return (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`flex flex-col items-center p-2 min-w-0 flex-1 ${
              active ? 'text-orange-600' : 'text-gray-500'
            }`}
          >
            <IconComponent className="w-6 h-6" />
            <span className="text-xs mt-1 truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomTabs;