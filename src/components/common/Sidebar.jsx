// 📁 src/components/common/Sidebar.jsx
import React from 'react';
import * as Icons from 'lucide-react';
import { navigationConfig } from '../../constants/navigationConfig';

const Sidebar = ({ currentRole, setActiveTab, activeTab, setCurrentRole }) => {
  const config = navigationConfig[currentRole];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b flex items-center space-x-2">
        <span>{config.avatar}</span>
        <h1 className="font-bold">Potluck</h1>
      </div>
      <nav className="mt-4">
        {config.navigation.map(item => {
          const Icon = Icons[item.icon];
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left ${activeTab === item.id ? 'bg-orange-50 text-orange-700' : 'text-gray-700'}`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4">
        <select
          value={currentRole}
          onChange={e => {
            setCurrentRole(e.target.value);
            setActiveTab('dashboard');
          }}
          className="w-full border p-2 rounded"
        >
          <option value="potchef">Potchef</option>
          <option value="potlucky">Potlucky</option>
          <option value="franchisee">Franchisee</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  );
};

export default Sidebar;
