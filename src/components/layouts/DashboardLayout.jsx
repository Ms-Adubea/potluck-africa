// 📁 src/layouts/DashboardLayout.jsx
import React from 'react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

const DashboardLayout = ({ children, currentRole, setCurrentRole, activeTab, setActiveTab }) => (
  <div className="flex h-screen bg-gray-100">
    <Sidebar currentRole={currentRole} setCurrentRole={setCurrentRole} setActiveTab={setActiveTab} activeTab={activeTab} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header currentRole={currentRole} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  </div>
);

export default DashboardLayout;