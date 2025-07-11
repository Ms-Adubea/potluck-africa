// 📁 src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';

const Dashboard = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(role || 'potchef');

  // Handle role switching
  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    navigate(`/dashboard/${newRole}`);
  };

  // Redirect to default role if no role is specified
  React.useEffect(() => {
    if (!role) {
      navigate(`/dashboard/${currentRole}`);
    }
  }, [role, currentRole, navigate]);

  return (
    <DashboardLayout 
      currentRole={currentRole} 
      setCurrentRole={handleRoleChange}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default Dashboard;