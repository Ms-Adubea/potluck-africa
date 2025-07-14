import React, { useState, useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';

const Dashboard = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(role || 'potlucky');

  // Get user's actual role from localStorage
  const userRole = localStorage.getItem('userRole');

  // Handle role switching
  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    navigate(`/dashboard/${newRole}`);
  };

  // Redirect to user's appropriate dashboard
  useEffect(() => {
    if (!role && userRole) {
      // If no role in URL but user has a role, redirect to their dashboard
      navigate(`/dashboard/${userRole}`, { replace: true });
    } else if (role && userRole && role !== userRole) {
      // If role in URL doesn't match user's role, redirect to their dashboard
      navigate(`/dashboard/${userRole}`, { replace: true });
    } else if (role) {
      // Update current role state to match URL
      setCurrentRole(role);
    }
  }, [role, userRole, navigate]);

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