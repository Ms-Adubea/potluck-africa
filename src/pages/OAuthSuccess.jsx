// 📁 src/components/auth/OAuthSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
// import { storeUserData, clearUserData, fetchUserProfile } from '../../services/auth';
import { setAuthToken } from '../services/config';
import { clearUserData, fetchUserProfile, storeUserData } from '../services/auth';
// import { setAuthToken } from '../../services/config';

const OAuthSuccess = () => {
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error', 'pending'
  const [message, setMessage] = useState('Processing your authentication...');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const authStatus = searchParams.get('status');

        console.log('OAuth callback params:', { token, error, authStatus });

        // Handle errors
        if (error) {
          setStatus('error');
          setMessage('Google authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Handle pending approval status
        if (authStatus === 'awaiting-approval') {
          setStatus('pending');
          setMessage('Account created successfully! Awaiting admin approval.');
          setTimeout(() => navigate('/pending'), 2000);
          return;
        }

        // Handle successful authentication
        if (token) {
          await handleAuthSuccess(token);
        } else {
          throw new Error('No authentication token received');
        }

      } catch (error) {
        console.error('OAuth processing error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try logging in again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate]);

  const handleAuthSuccess = async (token) => {
    try {
      // Clear any existing data
      clearUserData();
      
      // Store the token first
      localStorage.setItem('token', token);
      setAuthToken(token);
      
      // Fetch user data from backend
      const userData = await fetchUserProfile();
      
      // Check if user is approved
      if (userData.isApproved === false) {
        clearUserData();
        setStatus('pending');
        setMessage('Account created successfully! Awaiting admin approval.');
        setTimeout(() => navigate('/pending'), 2000);
        return;
      }
      
      // Store user data
      await storeUserData(userData);
      
      setStatus('success');
      setMessage('Authentication successful! Redirecting to your dashboard...');
      
      // Navigate based on role
      const roleRoute = getRoleRoute(userData.role);
      setTimeout(() => navigate(`/dashboard/${roleRoute}`, { replace: true }), 1500);
      
    } catch (error) {
      console.error('Auth success handler error:', error);
      clearUserData();
      
      // Check if it's an approval issue
      if (error.response?.status === 403 || 
          error.response?.data?.message?.includes('approval')) {
        setStatus('pending');
        setMessage('Account awaiting approval by admin.');
        setTimeout(() => navigate('/pending'), 2000);
      } else {
        throw error; // Re-throw to be caught by outer try-catch
      }
    }
  };

  // Role mapping for navigation
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

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'pending':
        return <Loader2 className="h-8 w-8 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      default:
        return <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'from-blue-500 to-blue-600';
      case 'success':
        return 'from-green-500 to-green-600';
      case 'pending':
        return 'from-yellow-500 to-yellow-600';
      case 'error':
        return 'from-red-500 to-red-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center pt-8 pb-6 px-8">
          <div className="flex justify-center mb-4">
            <div className={`p-3 bg-gradient-to-r ${getStatusColor()} rounded-full`}>
              {getStatusIcon()}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {status === 'processing' && 'Authenticating...'}
            {status === 'success' && 'Success!'}
            {status === 'pending' && 'Almost There!'}
            {status === 'error' && 'Oops!'}
          </h1>
          <p className="text-gray-600">{message}</p>
        </div>

        {/* Progress indicator */}
        <div className="px-8 pb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${getStatusColor()} h-2 rounded-full transition-all duration-500`}
              style={{
                width: status === 'processing' ? '30%' : 
                       status === 'success' ? '100%' : 
                       status === 'pending' ? '75%' : '0%'
              }}
            />
          </div>
          
          {status === 'error' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-orange-500 hover:text-orange-600 font-medium hover:underline transition-colors"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccess;