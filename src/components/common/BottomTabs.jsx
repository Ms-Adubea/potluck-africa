// 📁 src/components/common/Sidebar.jsx
import React from 'react';
import * as Icons from 'lucide-react';
import navigationConfig from '../../constants/navigationConfig';

const BottomTabs = ({ currentRole, activeTab, setActiveTab }) => {
  const config = navigationConfig[currentRole];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="grid grid-cols-4 h-16">
        {config.navigation.map(item => {
          const Icon = Icons[item.icon];
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 ${
                isActive 
                  ? 'text-orange-600 bg-orange-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabs;
