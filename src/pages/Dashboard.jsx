// 📁 src/pages/Dashboard.jsx
import React, { useState } from 'react';
import PotchefDashboard from '../components/roles/PotchefDashboard';
import PotluckyDashboard from '../components/roles/PotluckyDashboard';
import FranchiseeDashboard from '../components/roles/FranchiseeDashboard';
import AdminDashboard from '../components/roles/AdminDashboard';
import DashboardLayout from '../components/layouts/DashboardLayout';
import navigationConfig from '../constants/navigationConfig';


const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState('potchef');
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      switch (currentRole) {
        case 'potchef': return <PotchefDashboard />;
        case 'potlucky': return <PotluckyDashboard />;
        case 'franchisee': return <FranchiseeDashboard />;
        case 'admin': return <AdminDashboard />;
        default: return null;
      }
    }
    
    // Handle other tabs
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          {navigationConfig[currentRole].navigation.find(nav => nav.id === activeTab)?.label}
        </h2>
        <p className="text-gray-600">Content for {activeTab} tab will be implemented here.</p>
      </div>
    );
  };

  return (
    <DashboardLayout 
      currentRole={currentRole} 
      setCurrentRole={setCurrentRole} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;