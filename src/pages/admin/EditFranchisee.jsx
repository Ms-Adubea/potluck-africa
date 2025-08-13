import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  Loader2, 
  MapPin, 
  Phone, 
  User, 
  ExternalLink, 
  X, 
  Edit3
} from 'lucide-react';
import { apiUpdateFranchiseeText } from '../../services/admin';
import Swal from 'sweetalert2';

const EditFranchiseeModal = ({ franchisee, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    locationAddress: '',
    googleMapsLink: '',
    contactNumber: '',
    contactPerson: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data when franchisee changes
  useEffect(() => {
    if (franchisee && isOpen) {
      setFormData({
        businessName: franchisee.businessName || '',
        locationAddress: franchisee.locationAddress || '',
        googleMapsLink: franchisee.googleMapsLink || '',
        contactNumber: franchisee.contactNumber || '',
        contactPerson: franchisee.contactPerson || '',
        description: franchisee.description || ''
      });
      setErrors({});
    }
  }, [franchisee, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        businessName: '',
        locationAddress: '',
        googleMapsLink: '',
        contactNumber: '',
        contactPerson: '',
        description: ''
      });
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen]);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.businessName?.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.locationAddress?.trim()) {
      newErrors.locationAddress = 'Location address is required';
    }
    
    if (!formData.contactNumber?.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.contactPerson?.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.googleMapsLink && !isValidUrl(formData.googleMapsLink)) {
      newErrors.googleMapsLink = 'Please enter a valid Google Maps URL';
    }
    
    return newErrors;
  }, [formData]);

  // URL validation helper
  const isValidUrl = useCallback((string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }, []);

  // Handle input changes - FIXED: Optimized to prevent unnecessary re-renders
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Only clear error if there is an error for this field
    // Use functional update to prevent unnecessary re-renders
    setErrors(prev => {
      if (prev[field]) {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Show validation error with SweetAlert
      await Swal.fire({
        title: 'Validation Error',
        text: 'Please fix the errors in the form before submitting.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316'
      });
      return;
    }
    
    if (!franchisee?.id) return;

    setIsLoading(true);
    
    try {
      const updatedData = await apiUpdateFranchiseeText(franchisee.id, formData);
      
      // Call success callback with updated data
      if (onSuccess) {
        onSuccess(franchisee.id, updatedData);
      }
      
      // Show success message with SweetAlert
      await Swal.fire({
        title: 'Success!',
        text: 'Franchisee updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
        timer: 3000,
        timerProgressBar: true
      });
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Update franchisee error:', error);
      
      // Show error message with SweetAlert
      await Swal.fire({
        title: 'Update Failed',
        text: error.response?.data?.message || 'Failed to update franchisee. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle close
  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [isLoading, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, handleClose]);

  // Don't render if not open or no franchisee
  if (!isOpen || !franchisee) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3">
              <Edit3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Franchisee</h2>
              <p className="text-sm text-gray-600">{franchisee.businessName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.businessName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter business name"
                autoComplete="organization"
              />
            </div>
            {errors.businessName && (
              <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
            )}
          </div>

          {/* Location Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.locationAddress}
                onChange={(e) => handleInputChange('locationAddress', e.target.value)}
                disabled={isLoading}
                rows={3}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.locationAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full address"
                autoComplete="street-address"
              />
            </div>
            {errors.locationAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.locationAddress}</p>
            )}
          </div>

          {/* Google Maps Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Maps Link (Optional)
            </label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={formData.googleMapsLink}
                onChange={(e) => handleInputChange('googleMapsLink', e.target.value)}
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.googleMapsLink ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://maps.google.com/..."
                autoComplete="url"
              />
            </div>
            {errors.googleMapsLink && (
              <p className="mt-1 text-sm text-red-600">{errors.googleMapsLink}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter contact number"
                autoComplete="tel"
              />
            </div>
            {errors.contactNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
            )}
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter contact person name"
                autoComplete="name"
              />
            </div>
            {errors.contactPerson && (
              <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isLoading}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter franchisee description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Franchisee'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFranchiseeModal;