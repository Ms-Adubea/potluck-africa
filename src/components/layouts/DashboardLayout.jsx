// 📁 src/components/layouts/DashboardLayout.jsx
import React from 'react';
import Header from '../common/Header';
import BottomTabs from '../common/BottomTabs';

const DashboardLayout = ({ children, currentRole, setCurrentRole }) => (
  <div className="flex flex-col h-screen bg-gray-100">
    <Header currentRole={currentRole} setCurrentRole={setCurrentRole} />
    <main className="flex-1 overflow-y-auto p-4 pb-20">{children}</main>
    <BottomTabs currentRole={currentRole} />
  </div>
);

export default DashboardLayout;