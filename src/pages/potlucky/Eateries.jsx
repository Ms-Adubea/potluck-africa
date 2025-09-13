// 📁 src/pages/potlucky/Eateries.jsx - Restaurant discovery component
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  ExternalLink, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star,
  Clock,
  Navigation,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { apiGetAllFranchisees } from '../../services/admin';

const Eateries = () => {
  const [eateries, setEateries] = useState([]);
  const [filteredEateries, setFilteredEateries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEatery, setSelectedEatery] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    sortBy: 'name' // 'name', 'location'
  });

  useEffect(() => {
    fetchEateries();
  }, []);

  useEffect(() => {
    filterEateries();
  }, [eateries, searchQuery, filters]);

  const fetchEateries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGetAllFranchisees();
      
      // Filter only published eateries
      const publishedEateries = response.filter(eatery => eatery.isPublished);
      setEateries(publishedEateries);
    } catch (err) {
      console.error('Error fetching eateries:', err);
      setError('Failed to load eateries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterEateries = () => {
    let filtered = [...eateries];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(eatery => 
        eatery.businessName.toLowerCase().includes(query) ||
        eatery.locationAddress.toLowerCase().includes(query) ||
        eatery.description.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (filters.location.trim()) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(eatery => 
        eatery.locationAddress.toLowerCase().includes(location)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.businessName.localeCompare(b.businessName);
        case 'location':
          return a.locationAddress.localeCompare(b.locationAddress);
        default:
          return 0;
      }
    });

    setFilteredEateries(filtered);
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleDirections = (googleMapsLink) => {
    window.open(googleMapsLink, '_blank');
  };

  const openImageModal = (eatery, imageIndex = 0) => {
    setSelectedEatery(eatery);
    setSelectedImageIndex(imageIndex);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedEatery(null);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (selectedEatery && selectedImageIndex < selectedEatery.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const EateryCard = ({ eatery, isListView = false }) => (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${isListView ? 'flex' : ''}`}>
      {/* Image Section */}
      <div className={`relative ${isListView ? 'w-48 flex-shrink-0' : 'h-48'} bg-gray-200`}>
        {eatery.images && eatery.images.length > 0 ? (
          <img
            src={eatery.images[0]}
            alt={eatery.businessName}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openImageModal(eatery, 0)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
            <div className="text-center">
              <div className="text-4xl mb-2">🍽️</div>
              <p className="text-sm text-gray-600">No image</p>
            </div>
          </div>
        )}
        
        {/* Image Count Badge */}
        {eatery.images && eatery.images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
            +{eatery.images.length - 1} more
          </div>
        )}

        {/* Online Status Badge */}
        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
          Open
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
            {eatery.businessName}
          </h3>
          <div className="flex items-center text-yellow-500 text-sm ml-2">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1">4.8</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {eatery.description}
        </p>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="line-clamp-1">{eatery.locationAddress}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Phone className="w-4 h-4 mr-2" />
          <span>{eatery.contactNumber}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Clock className="w-4 h-4 mr-2" />
          <span>Open 9:00 AM - 10:00 PM</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleCall(eatery.contactNumber)}
            className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </button>
          
          <button
            onClick={() => handleDirections(eatery.googleMapsLink)}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Directions
          </button>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Finding amazing eateries...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchEateries}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Eateries</h1>
              <p className="text-gray-600 text-sm">Discover places to dine</p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search eateries, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md ${
                showFilters ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-3">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Filter by location"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="px-3 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="location">Sort by Location</option>
                </select>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
            <span>{filteredEateries.length} eateries found</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-orange-500 hover:text-orange-600"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredEateries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No eateries found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }>
            {filteredEateries.map((eatery) => (
              <EateryCard 
                key={eatery.id} 
                eatery={eatery} 
                isListView={viewMode === 'list'} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {imageModalOpen && selectedEatery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {selectedEatery.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={selectedImageIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 disabled:opacity-30"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  disabled={selectedImageIndex === selectedEatery.images.length - 1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 disabled:opacity-30"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={selectedEatery.images[selectedImageIndex]}
              alt={`${selectedEatery.businessName} - Image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image Counter */}
            {selectedEatery.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {selectedEatery.images.length}
              </div>
            )}

            {/* Eatery Info */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg max-w-xs">
              <h3 className="font-semibold">{selectedEatery.businessName}</h3>
              <p className="text-sm opacity-90">{selectedEatery.locationAddress}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eateries;