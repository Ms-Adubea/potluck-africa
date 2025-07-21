import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  
  // Check for token with both possible key names
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole');

  console.log('ProtectedRoute check:', { token: !!token, userRole, requiredRole });

  // Check if user is authenticated
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required role (if specified)
  if (requiredRole && userRole !== requiredRole) {
    console.log(`Role mismatch: required ${requiredRole}, user has ${userRole}`);
    
    // Redirect to their appropriate dashboard
    const roleRouteMap = {
      potchef: '/dashboard/potchef',
      potlucky: '/dashboard/potlucky',
      franchisee: '/dashboard/franchisee',
      admin: '/dashboard/admin'
    };
    
    const redirectTo = roleRouteMap[userRole] || '/dashboard/potlucky';
    console.log('Redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  console.log('ProtectedRoute: Access granted');
  return children;
};

export default ProtectedRoute;