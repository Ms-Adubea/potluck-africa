import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole');

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required role (if specified)
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to their appropriate dashboard
    const roleRouteMap = {
      potchef: '/dashboard/potchef',
      potlucky: '/dashboard/potlucky',
      franchisee: '/dashboard/franchisee',
      admin: '/dashboard/admin'
    };
    
    const redirectTo = roleRouteMap[userRole] || '/dashboard/potlucky';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;