// 📁 src/pages/admin/PendingUserDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock,
  ChefHat,
  ShoppingCart,
  Building2,
  Shield,
  Heart,
  MapPin
} from 'lucide-react';
import { apiGetOnePendingUser, apiApproveUser } from '../../services/admin';

const PendingUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await apiGetOnePendingUser(id);
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (action) => {
    try {
      setProcessing(true);
      await apiApproveUser(id, { action });
      
      // Show success message
      alert(`User ${action}d successfully!`);
      
      // Navigate back to pending users list
      navigate('/dashboard/admin/pending-users');
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(`Failed to ${action} user. Please try again.`);
    } finally {
      setProcessing(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'potchef':
        return <ChefHat className="w-5 h-5" />;
      case 'potlucky':
        return <ShoppingCart className="w-5 h-5" />;
      case 'franchisee':
        return <Building2 className="w-5 h-5" />;
      case 'admin':
        return <Shield className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'potchef':
        return 'bg-orange-100 text-orange-800';
      case 'potlucky':
        return 'bg-blue-100 text-blue-800';
      case 'franchisee':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
        <p className="text-gray-500 mb-4">The requested user could not be found.</p>
        <button
          onClick={() => navigate('/dashboard/admin/pending-users')}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Back to Pending Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/admin/pending-users')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
              <p className="text-gray-600">Review user registration information</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">Pending Approval</span>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                  <span className="ml-2 capitalize">{user.role}</span>
                </span>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Applied on {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Status</label>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${user.profileCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {user.profileCompleted ? 'Complete' : 'Incomplete'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <p className="text-sm text-gray-600">{formatDate(user.updatedAt)}</p>
            </div>
            {user.favorites && user.favorites.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favorites</label>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">{user.favorites.length} items</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Review the user's information and decide whether to approve or reject their registration.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleApproval('approve')}
                disabled={processing}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Approve User</span>
              </button>
              <button
                onClick={() => handleApproval('reject')}
                disabled={processing}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <XCircle className="w-5 h-5" />
                <span>Reject User</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">Role</span>
            </div>
            <p className="text-sm text-gray-600 capitalize">{user.role}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">Created</span>
            </div>
            <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">Status</span>
            </div>
            <p className="text-sm text-orange-600 font-medium">Pending Approval</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingUserDetail;