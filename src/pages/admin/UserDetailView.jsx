// UserDetailView.jsx
import React from 'react';
import { 
  Trash2, Users, Eye, AlertCircle, 
  CheckCircle, XCircle, Mail, 
  Phone, User, Shield, RefreshCw,
  ChevronRight, Search, Plus,
  Calendar, MapPin, Activity
} from 'lucide-react';
// import { apiDeleteUser } from './api'; // Import your API functions

const UserDetailView = ({ user, onBack, onDelete, deleteLoading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (isApproved) => {
    return isApproved ? 'text-green-600' : 'text-amber-600';
  };

  const getStatusIcon = (isApproved) => {
    return isApproved ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;
  };

  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'potchef': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'franchisee': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'potlucky': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return '👑';
      case 'potchef': return '👨‍🍳';
      case 'franchisee': return '🏢';
      case 'potlucky': return '🍽️';
      default: return '👤';
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || '??';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180 text-slate-600" />
            </button>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">User Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {getInitials(user.firstName, user.lastName)}
                    </span>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  {user.firstName || 'N/A'} {user.lastName || ''}
                </h2>
                <p className="text-sm text-slate-500 mb-4">ID: {user.id || user._id}</p>
                
                {/* Role Badge */}
                <div className="flex justify-center mb-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
                    <span className="mr-1.5">{getRoleIcon(user.role)}</span>
                    {user.role || 'N/A'}
                  </span>
                </div>

                {/* Status Indicators */}
                <div className="flex justify-center gap-4 text-sm mb-6">
                  <div className={`flex items-center gap-1.5 ${getStatusColor(user.isApproved)}`}>
                    {getStatusIcon(user.isApproved)}
                    <span className="font-medium">{user.isApproved ? 'Approved' : 'Pending'}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${user.profileCompleted ? 'text-green-600' : 'text-amber-600'}`}>
                    {user.profileCompleted ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span className="font-medium">{user.profileCompleted ? 'Complete' : 'Incomplete'}</span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => onDelete(user.id || user._id)}
                  disabled={deleteLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {deleteLoading ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-600">Email</p>
                      <p className="text-sm text-slate-900">{user.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-medium text-slate-600">Phone</p>
                      <p className="text-sm text-slate-900">{user.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Source:</span>
                      <span className="text-sm text-slate-900 capitalize">{user.source || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Favorites:</span>
                      <span className="text-sm text-slate-900">{user.favorites?.length || 0} items</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Created:</span>
                      <span className="text-sm text-slate-900">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Updated:</span>
                      <span className="text-sm text-slate-900">{formatDate(user.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailView;