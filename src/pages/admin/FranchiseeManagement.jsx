import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Building2, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Plus,
  ChevronDown,
  RefreshCw
} from 'lucide-react';

// Mock API function - replace with your actual API import
const apiGetAllFranchisees = async () => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data - replace with actual API call
  return {
    data: [
      {
        id: 1,
        name: "Metro Food Hub",
        ownerName: "Sarah Johnson",
        email: "sarah@metrofoodhub.com",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        address: "123 Broadway Street, New York, NY 10001",
        status: "active",
        joinedDate: "2024-01-15",
        totalChefs: 12,
        totalOrders: 450,
        revenue: 25000
      },
      {
        id: 2,
        name: "Downtown Delights",
        ownerName: "Mike Chen",
        email: "mike@downtowndelights.com",
        phone: "+1 (555) 234-5678",
        location: "Los Angeles, CA",
        address: "456 Main Street, Los Angeles, CA 90210",
        status: "active",
        joinedDate: "2024-02-20",
        totalChefs: 8,
        totalOrders: 320,
        revenue: 18500
      },
      {
        id: 3,
        name: "Coastal Kitchen Co.",
        ownerName: "Emily Rodriguez",
        email: "emily@coastalkitchen.com",
        phone: "+1 (555) 345-6789",
        location: "Miami, FL",
        address: "789 Ocean Drive, Miami, FL 33139",
        status: "pending",
        joinedDate: "2024-03-10",
        totalChefs: 5,
        totalOrders: 150,
        revenue: 8200
      },
      {
        id: 4,
        name: "Urban Eats",
        ownerName: "David Kim",
        email: "david@urbaneats.com",
        phone: "+1 (555) 456-7890",
        location: "Chicago, IL",
        address: "321 State Street, Chicago, IL 60601",
        status: "suspended",
        joinedDate: "2023-11-05",
        totalChefs: 15,
        totalOrders: 680,
        revenue: 32000
      }
    ],
    total: 4
  };
};

const FranchiseeManagement = () => {
  const [franchisees, setFranchisees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch franchisees on component mount
  useEffect(() => {
    fetchFranchisees();
  }, []);

  const fetchFranchisees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGetAllFranchisees();
      setFranchisees(response.data || []);
    } catch (err) {
      setError('Failed to fetch franchisees. Please try again.');
      console.error('Error fetching franchisees:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort franchisees
  const filteredFranchisees = franchisees
    .filter(franchisee => {
      const matchesSearch = franchisee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           franchisee.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           franchisee.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || franchisee.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      suspended: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchFranchisees}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Franchisee Management
          </h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Franchisee
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{franchisees.length}</div>
              <div className="text-sm text-gray-600">Total Franchisees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {franchisees.filter(f => f.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {franchisees.filter(f => f.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {franchisees.reduce((sum, f) => sum + f.totalChefs, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Chefs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search franchisees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="joinedDate-desc">Newest First</option>
            <option value="joinedDate-asc">Oldest First</option>
            <option value="revenue-desc">Highest Revenue</option>
            <option value="totalChefs-desc">Most Chefs</option>
          </select>
          
          <button
            onClick={fetchFranchisees}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredFranchisees.length} of {franchisees.length} franchisees
        </p>
      </div>

      {/* Franchisees Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFranchisees.map((franchisee) => (
          <div key={franchisee.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{franchisee.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {franchisee.ownerName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(franchisee.status)}
                  <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{franchisee.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{franchisee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{franchisee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(franchisee.joinedDate)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{franchisee.totalChefs}</div>
                    <div className="text-xs text-gray-600">Chefs</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{franchisee.totalOrders}</div>
                    <div className="text-xs text-gray-600">Orders</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{formatCurrency(franchisee.revenue)}</div>
                    <div className="text-xs text-gray-600">Revenue</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm inline-flex items-center justify-center gap-1">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFranchisees.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No franchisees found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by adding your first franchisee'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Franchisee
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FranchiseeManagement;