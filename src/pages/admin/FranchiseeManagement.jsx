import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Loader2, 
  Search, 
  MapPin, 
  Phone, 
  User, 
  ExternalLink, 
  Eye,
  X, 
  Edit3, 
  Trash2,
  Plus,
  Calendar,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/config';
import { 
  apiGetAllFranchisees, 
   
  apiGetFranchiseeById
} from '../../services/admin';
import EditFranchiseeModal from './EditFranchisee';

const FranchiseeManagement = () => {
  const [franchisees, setFranchisees] = useState([]);
  const [filteredFranchisees, setFilteredFranchisees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  // Fetch all franchisees
  const fetchFranchisees = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiGetAllFranchisees();
      setFranchisees(data);
      setFilteredFranchisees(data);
    } catch (error) {
      console.error('Fetch franchisees error:', error);
      setError(error.response?.data?.message || 'Failed to fetch franchisees');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFranchisees();
  }, []);

  // Filter franchisees based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFranchisees(franchisees);
    } else {
      const filtered = franchisees.filter(franchisee =>
        franchisee.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        franchisee.locationAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        franchisee.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        franchisee.contactNumber?.includes(searchTerm)
      );
      setFilteredFranchisees(filtered);
    }
  }, [searchTerm, franchisees]);

  // Handle delete franchisee
  const handleDelete = async (franchiseeId) => {
    if (!window.confirm('Are you sure you want to delete this franchisee? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    
    try {
      await apiDeleteFranchisee(franchiseeId);
      setFranchisees(prev => prev.filter(f => f.id !== franchiseeId));
      setFilteredFranchisees(prev => prev.filter(f => f.id !== franchiseeId));
      alert('Franchisee deleted successfully');
    } catch (error) {
      console.error('Delete franchisee error:', error);
      alert(error.response?.data?.message || 'Failed to delete franchisee');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle edit franchisee
  const handleEdit = (franchisee) => {
    setSelectedFranchisee(franchisee);
    setShowEditModal(true);
  };

  // Handle edit success
  const handleEditSuccess = (franchiseeId, updatedData) => {
    // Update the franchisees in state
    setFranchisees(prev => prev.map(f => 
      f.id === franchiseeId ? { ...f, ...updatedData } : f
    ));
    setFilteredFranchisees(prev => prev.map(f => 
      f.id === franchiseeId ? { ...f, ...updatedData } : f
    ));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // View franchisee details modal
  const FranchiseeModal = ({ franchisee, onClose }) => {
    if (!franchisee) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{franchisee.businessName}</h2>
                <p className="text-sm text-gray-600">Franchisee Details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Images */}
            {franchisee.images && franchisee.images.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {franchisee.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`${franchisee.businessName} ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/150/100';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Person</h3>
                <div className="flex items-center text-gray-900">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  {franchisee.contactPerson}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Number</h3>
                <div className="flex items-center text-gray-900">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {franchisee.contactNumber}
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Address</h3>
                <div className="flex items-start text-gray-900">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-1 flex-shrink-0" />
                  <span>{franchisee.locationAddress}</span>
                </div>
              </div>

              {franchisee.googleMapsLink && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Google Maps</h3>
                  <a
                    href={franchisee.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Google Maps
                  </a>
                </div>
              )}

              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-900 leading-relaxed">{franchisee.description}</p>
              </div>

              {franchisee.createdAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Created</h3>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(franchisee.createdAt)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-orange-100">
        <div className="text-center">
          <div className="p-4 bg-white rounded-full shadow-lg mb-4 inline-block">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
          <p className="text-gray-600 font-medium">Loading franchisees...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="p-3 bg-red-100 rounded-full inline-block mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Franchisees</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-3">
            <button
              onClick={fetchFranchisees}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
            <Link
              to="/dashboard/admin"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors inline-block"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Franchisees</h1>
          <p className="text-gray-600">Manage your franchisee locations</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search franchisees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchFranchisees}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <Link
                to="/dashboard/admin/add-franchisee"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Franchisee
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredFranchisees.length}</span> of{' '}
              <span className="font-medium">{franchisees.length}</span> franchisees
            </p>
          </div>
        </div>

        {/* Franchisees Grid */}
        {filteredFranchisees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="p-3 bg-gray-100 rounded-full inline-block mb-4">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Franchisees Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No franchisees match your search criteria.' : 'No franchisees have been added yet.'}
            </p>
            {!searchTerm && (
              <Link
                to="/dashboard/admin/add-franchisee"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Franchisee
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFranchisees.map((franchisee) => (
              <div key={franchisee.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {franchisee.images && franchisee.images.length > 0 ? (
                    <img
                      src={franchisee.images[0]}
                      alt={franchisee.businessName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/400/200';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {franchisee.images && franchisee.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                      +{franchisee.images.length - 1} more
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {franchisee.businessName}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{franchisee.locationAddress}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="line-clamp-1">{franchisee.contactPerson}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{franchisee.contactNumber}</span>
                    </div>
                  </div>

                  {franchisee.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {franchisee.description}
                    </p>
                  )}

                  {franchisee.createdAt && (
                    <div className="text-xs text-gray-500 mb-4">
                      Created {formatDate(franchisee.createdAt)}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedFranchisee(franchisee);
                        setShowModal(true);
                      }}
                      className="flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(franchisee)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(franchisee.id)}
                        disabled={deleteLoading}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleteLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            to="/dashboard/admin"
            className="text-orange-500 hover:text-orange-600 font-medium hover:underline transition-colors"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <FranchiseeModal
          franchisee={selectedFranchisee}
          onClose={() => {
            setShowModal(false);
            setSelectedFranchisee(null);
          }}
        />
      )}

      {/* Edit Modal */}
      <EditFranchiseeModal
        franchisee={selectedFranchisee}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedFranchisee(null);
        }}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default FranchiseeManagement;