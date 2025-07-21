// AdminUserManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Trash2, Users, Eye, AlertCircle, 
  CheckCircle, XCircle, Mail, 
  Phone, User, Shield, RefreshCw,
  ChevronRight, Search, Plus,
  Calendar, MapPin, Activity
} from 'lucide-react';
// import { apiGetAllUsers, apiDeleteUser, apiGetUser } from './api';
import UserDetailView from './UserDetailView';
import { apiDeleteUser, apiGetAllUsers, apiGetUserById } from '../../services/admin';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGetAllUsers();
      
      let usersArray = [];
      let statsData = {};
      
      if (Array.isArray(data)) {
        usersArray = data;
      } else if (data && Array.isArray(data.users)) {
        usersArray = data.users;
        statsData = {
          totalUsers: data.totalUsers || usersArray.length,
          roleCounts: data.roleCounts || {}
        };
      } else if (data && Array.isArray(data.data)) {
        usersArray = data.data;
      } else {
        console.warn('Unexpected data format:', data);
        usersArray = [];
      }
      
      setUsers(usersArray);
      setStats(statsData);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      setLoading(true);
      const user = await apiGetUserById(userId);
      setSelectedUser(user);
    } catch (err) {
      console.error('Fetch user error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setDeleteLoading(userId);
      await apiDeleteUser(userId);
      setUsers(users.filter(user => user.id !== userId || user._id !== userId));
      setDeleteConfirm(null);
      if (selectedUser && (selectedUser.id === userId || selectedUser._id === userId)) {
        setSelectedUser(null);
      }
      alert('User deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete user');
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

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

  const safeUsers = Array.isArray(users) ? users : [];
  
  const filteredUsers = safeUsers.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !selectedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (selectedUser) {
    return (
      <UserDetailView 
        user={selectedUser} 
        onBack={() => setSelectedUser(null)}
        onDelete={handleDeleteUser}
        deleteLoading={deleteLoading === (selectedUser.id || selectedUser._id)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                <p className="text-slate-600">Manage and monitor all platform users</p>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>

          {/* Stats Cards */}
          {stats.roleCounts && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(stats.roleCounts).map(([role, count]) => (
                <div key={role} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getRoleIcon(role)}</span>
                    <span className="text-sm font-medium text-slate-600 capitalize">{role}s</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>

            <button
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Users Grid */}
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id || user._id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  {/* Profile Picture */}
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-white">
                        {getInitials(user.firstName, user.lastName)}
                      </span>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900 text-lg truncate">
                        {user.firstName || 'N/A'} {user.lastName || ''}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        <span className="mr-1">{getRoleIcon(user.role)}</span>
                        {user.role || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{user.email || 'N/A'}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className={`flex items-center gap-1 ${getStatusColor(user.isApproved)}`}>
                        {getStatusIcon(user.isApproved)}
                        <span className="font-medium">{user.isApproved ? 'Approved' : 'Pending'}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${user.profileCompleted ? 'text-green-600' : 'text-amber-600'}`}>
                        {user.profileCompleted ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        <span className="font-medium">{user.profileCompleted ? 'Complete' : 'Incomplete'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchUserDetails(user.id || user._id)}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => setDeleteConfirm(user.id || user._id)}
                      disabled={deleteLoading === (user.id || user._id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete User"
                    >
                      {deleteLoading === (user.id || user._id) ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm ? 'No users found' : 'No users yet'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or clear the search to see all users.' 
                : 'When users join your platform, they will appear here.'}
            </p>
            {!searchTerm && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                Add First User
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Delete User</h3>
                <p className="text-sm text-slate-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-slate-700 mb-6">
              Are you sure you want to delete this user? All associated data will be permanently removed.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                disabled={deleteLoading === deleteConfirm}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteLoading === deleteConfirm ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;