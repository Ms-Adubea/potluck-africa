import React, { useState, useEffect } from 'react';
import { 
  Trash2, Users, Eye, EyeOff, AlertCircle, 
  CheckCircle, XCircle, Calendar, Mail, 
  Phone, User, Shield, RefreshCw 
} from 'lucide-react';
import { apiDeleteUser, apiGetAllUsers } from '../../services/admin';
// import { apiGetAllUsers, apiDeleteUser } from '../services/api';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGetAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
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
    switch(role.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'potchef': return 'bg-blue-100 text-blue-800';
      case 'franchisee': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Manage all users in the system</p>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Users ({users.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <React.Fragment key={user.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="h-full w-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName || 'N/A'} {user.lastName || ''}
                          </div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {user.email || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {user.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-1 ${getStatusColor(user.isApproved)}`}>
                        {getStatusIcon(user.isApproved)}
                        <span className="text-sm">
                          {user.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-1 ${user.profileCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                        {user.profileCompleted ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span className="text-sm">
                          {user.profileCompleted ? 'Complete' : 'Incomplete'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title={expandedUser === user.id ? "Hide details" : "View details"}
                        >
                          {expandedUser === user.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          disabled={deleteLoading === user.id}
                          className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50"
                          title="Delete user"
                        >
                          {deleteLoading === user.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedUser === user.id && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Additional Details</h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Source:</span> {user.source || 'N/A'}</p>
                              <p><span className="font-medium">Favorites:</span> {user.favorites?.length || 0} items</p>
                              <p><span className="font-medium">Last Updated:</span> {formatDate(user.updatedAt)}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !loading && (
          <div className="px-6 py-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
            <button
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                disabled={deleteLoading === deleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
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