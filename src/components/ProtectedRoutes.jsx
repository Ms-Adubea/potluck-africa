// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';

// const ProtectedRoute = ({ children, requiredRole = null }) => {
//   const location = useLocation();
  
//   // Check for token with both possible key names
//   const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
//   const userRole = localStorage.getItem('userRole');

//   console.log('ProtectedRoute check:', { token: !!token, userRole, requiredRole });

//   // Check if user is authenticated
//   if (!token) {
//     console.log('No token found, redirecting to login');
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Check if user has the required role (if specified)
//   if (requiredRole && userRole !== requiredRole) {
//     console.log(`Role mismatch: required ${requiredRole}, user has ${userRole}`);
    
//     // Redirect to their appropriate dashboard
//     const roleRouteMap = {
//       potchef: '/dashboard/potchef',
//       potlucky: '/dashboard/potlucky',
//       franchisee: '/dashboard/franchisee',
//       admin: '/dashboard/admin'
//     };
    
//     const redirectTo = roleRouteMap[userRole] || '/dashboard/potlucky';
//     console.log('Redirecting to:', redirectTo);
//     return <Navigate to={redirectTo} replace />;
//   }

//   console.log('ProtectedRoute: Access granted');
//   return children;
// };

// export default ProtectedRoute;


import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole, getCurrentUser } from '../services/auth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Get current user data
  const currentUser = getCurrentUser();
  const userRole = getUserRole();

  // Check if user is approved (except for pending approval page)
  if (currentUser && currentUser.isApproved === false) {
    return <Navigate to="/pending" replace />;
  }

  // Check role-based access
  if (requiredRole) {
    if (!userRole) {
      return <Navigate to="/login" replace />;
    }

    // Normalize role comparison
    const normalizedUserRole = userRole.toLowerCase();
    const normalizedRequiredRole = requiredRole.toLowerCase();

    // Handle franchise/franchisee role variations
    const isAuthorized = normalizedUserRole === normalizedRequiredRole ||
                        (normalizedRequiredRole === 'franchisee' && 
                         (normalizedUserRole === 'franchise' || normalizedUserRole === 'franchisee'));

    if (!isAuthorized) {
      // Redirect to appropriate dashboard based on user's actual role
      const roleRoute = getRoleRoute(userRole);
      return <Navigate to={`/dashboard/${roleRoute}`} replace />;
    }
  }

  return children;
};

// Helper function to get route based on role
const getRoleRoute = (role) => {
  const roleMap = {
    'potchef': 'potchef',
    'potlucky': 'potlucky', 
    'franchise': 'franchisee',
    'franchisee': 'franchisee',
    'admin': 'admin'
  };
  return roleMap[role?.toLowerCase()] || 'potlucky';
};

export default ProtectedRoute;