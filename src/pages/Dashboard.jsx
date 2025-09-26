// 📁 src/pages/Dashboard.jsx - Fixed version
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { getCurrentUser, isAuthenticated } from '../services/auth';

const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          console.log('User not authenticated, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }

        // Get role from multiple sources with fallbacks
        let userRole = null;

        // 1. Try to extract from URL path
        const pathParts = location.pathname.split('/');
        const roleFromPath = pathParts[2]; // /dashboard/[role]/...
        
        if (roleFromPath && ['potchef', 'potlucky', 'franchisee', 'admin'].includes(roleFromPath)) {
          userRole = roleFromPath;
        }

        // 2. Fallback to localStorage
        if (!userRole) {
          userRole = localStorage.getItem('userRole');
        }

        // 3. Fallback to getCurrentUser function
        if (!userRole) {
          const currentUser = getCurrentUser();
          userRole = currentUser?.role;
        }

        // 4. Final validation
        if (!userRole || !['potchef', 'potlucky', 'franchisee', 'admin'].includes(userRole)) {
          console.error('Invalid or missing user role:', userRole);
          // Clear potentially corrupted data
          localStorage.clear();
          navigate('/login', { replace: true });
          return;
        }

        console.log('Dashboard initialized with role:', userRole);
        setCurrentRole(userRole);

        // Redirect to appropriate default route if on base dashboard path
        if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
          const defaultRoutes = {
            potlucky: '/dashboard/potlucky/browse',
            potchef: '/dashboard/potchef',
            franchisee: '/dashboard/franchisee',
            admin: '/dashboard/admin'
          };
          navigate(defaultRoutes[userRole] || '/dashboard/potlucky/browse', { replace: true });
        }

      } catch (error) {
        console.error('Dashboard initialization error:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [location.pathname, navigate]);

  // Show loading state while determining role
  if (isLoading || !currentRole) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout currentRole={currentRole} setCurrentRole={setCurrentRole}>
      <Outlet />
    </DashboardLayout>
  );
};

export default Dashboard;