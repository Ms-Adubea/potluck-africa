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
  CreditCard,
  Building,
  AlertCircle,
  CheckCircle2,
  LogIn
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
      
      alert(`User ${action}d successfully!`);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
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
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
              <Clock className="w-4 h-4 mr-1" />
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center border-4 border-gray-100">
                  <User className="w-12 h-12 text-white" />
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
                <div className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>{user.loginCount} login{user.loginCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Profile Status</p>
              <p className="text-lg font-semibold mt-1">
                {user.profileCompleted ? 'Complete' : 'Incomplete'}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-full ${user.profileCompleted ? 'bg-green-100' : 'bg-yellow-100'} flex items-center justify-center`}>
              {user.profileCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approval Status</p>
              <p className={`text-lg font-semibold mt-1 ${user.canBeApproved ? 'text-green-600' : 'text-red-600'}`}>
                {user.canBeApproved ? 'Ready' : 'Not Ready'}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-full ${user.canBeApproved ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
              {user.canBeApproved ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Favorites</p>
              <p className="text-lg font-semibold mt-1">{user.favorites?.length || 0}</p>
            </div>
            <Heart className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Login Count</p>
              <p className="text-lg font-semibold mt-1">{user.loginCount}</p>
            </div>
            <LogIn className="w-10 h-10 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Missing Requirements Alert */}
      {user.missingRequirements && user.missingRequirements.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-2">Missing Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                {user.missingRequirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Payout Details */}
      {user.payoutDetails && user.payoutDetails.bank && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Payout Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payout Type</label>
                <p className="text-sm text-gray-900 capitalize">{user.payoutDetails.type || 'Bank'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <p className="text-sm text-gray-900">{user.payoutDetails.bank.accountName || 'Not provided'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Code</label>
                <p className="text-sm text-gray-900 font-mono">{user.payoutDetails.bank.bankCode || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <p className="text-sm text-gray-900 font-mono">{user.payoutDetails.bank.accountNumber || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <span className="font-medium text-gray-900">Last Updated</span>
            </div>
            <p className="text-sm text-gray-600">{formatDate(user.updatedAt)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">User ID</span>
            </div>
            <p className="text-sm text-gray-600 font-mono break-all">{user._id}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Actions</h3>
        <p className="text-sm text-gray-600 mb-4">
          Review all the information above and decide whether to approve or reject this user's registration.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => handleApproval('approve')}
            disabled={processing || !user.canBeApproved}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Approve User</span>
          </button>
          <button
            onClick={() => handleApproval('reject')}
            disabled={processing}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Reject User</span>
          </button>
        </div>
        {!user.canBeApproved && (
          <p className="text-sm text-red-600 mt-3 flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>This user cannot be approved until all requirements are met.</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default PendingUserDetail;