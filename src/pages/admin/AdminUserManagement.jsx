import React, { useState, useEffect } from 'react';
import { 
  Trash2, Users, Eye, AlertCircle, 
  CheckCircle, XCircle, Mail, 
  Phone, User, Shield, RefreshCw,
  ChevronRight, Search
} from 'lucide-react';
import { apiDeleteUser, apiGetAllUsers } from '../../services/admin';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGetAllUsers();
      
      // Handle different response formats
      let usersArray;
      if (Array.isArray(data)) {
        usersArray = data;
      } else if (data && Array.isArray(data.users)) {
        usersArray = data.users;
      } else if (data && Array.isArray(data.data)) {
        usersArray = data.data;
      } else {
        console.warn('Unexpected data format:', data);
        usersArray = [];
      }
      
      setUsers(usersArray);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setDeleteLoading(userId);
      await apiDeleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setDeleteConfirm(null);
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete user');
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
    return isApproved ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (isApproved) => {
    return isApproved ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'potchef': return 'bg-blue-100 text-blue-800';
      case 'franchisee': return 'bg-orange-100 text-orange-800';
      case 'potlucky': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];
  
  const filteredUsers = safeUsers.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // User Detail View Component
  const UserDetailView = ({ user, onBack, onDelete }) => (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">User Details</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* User Header */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {user.firstName || 'N/A'} {user.lastName || ''}
          </h2>
          <p className="text-sm text-gray-500 mb-3">ID: {user.id}</p>
          
          <div className="flex justify-center gap-2 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
              <Shield className="w-3 h-3 mr-1" />
              {user.role || 'N/A'}
            </span>
          </div>

          <div className="flex justify-center gap-4 text-sm">
            <div className={`flex items-center gap-1 ${getStatusColor(user.isApproved)}`}>
              {getStatusIcon(user.isApproved)}
              <span>{user.isApproved ? 'Approved' : 'Pending'}</span>
            </div>
            <div className={`flex items-center gap-1 ${user.profileCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
              {user.profileCompleted ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{user.profileCompleted ? 'Complete' : 'Incomplete'}</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-900">{user.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-900">{user.phone || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Additional Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Source:</span>
              <span className="text-gray-900">{user.source || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Favorites:</span>
              <span className="text-gray-900">{user.favorites?.length || 0} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="text-gray-900">{formatDate(user.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="text-gray-900">{formatDate(user.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4">
          <button
            onClick={() => onDelete(user.id)}
            disabled={deleteLoading === user.id}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {deleteLoading === user.id ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
            {deleteLoading === user.id ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show user detail view if a user is selected
  if (selectedUser) {
    return (
      <UserDetailView 
        user={selectedUser} 
        onBack={() => setSelectedUser(null)}
        onDelete={(userId) => setDeleteConfirm(userId)}
      />
    );
  }

  // Main user list view
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-green-600" />
          <h1 className="text-xl font-bold text-gray-900">Users</h1>
          <span className="ml-auto text-sm text-gray-500">({filteredUsers.length})</span>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </button>
      </div>

      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {user.firstName || 'N/A'} {user.lastName || ''}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{user.email || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className={`flex items-center gap-1 ${getStatusColor(user.isApproved)}`}>
                        {getStatusIcon(user.isApproved)}
                        <span>{user.isApproved ? 'Approved' : 'Pending'}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${user.profileCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                        {user.profileCompleted ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        <span>{user.profileCompleted ? 'Complete' : 'Incomplete'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No users found matching your search' : 'No users found'}
            </p>
            {!searchTerm && (
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                disabled={deleteLoading === deleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading === deleteConfirm ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;