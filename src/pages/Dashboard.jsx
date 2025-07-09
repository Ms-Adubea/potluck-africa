// 📁 src/pages/Dashboard.jsx
import React, { useState } from 'react';
import PotchefDashboard from '../components/roles/PotchefDashboard';
import PotluckyDashboard from '../components/roles/PotluckyDashboard';
import FranchiseeDashboard from '../components/roles/FranchiseeDashboard';
import AdminDashboard from '../components/roles/AdminDashboard';
import DashboardLayout from '../components/layouts/DashboardLayout';


const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState('potchef');
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentRole) {
      case 'potchef': return <PotchefDashboard />;
      case 'potlucky': return <PotluckyDashboard />;
      case 'franchisee': return <FranchiseeDashboard />;
      case 'admin': return <AdminDashboard />;
      default: return null;
    }
  };

  return (
    <DashboardLayout currentRole={currentRole} setCurrentRole={setCurrentRole} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;