import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Building2, 
  Loader2, 
  MapPin, 
  Phone, 
  User, 
  ExternalLink, 
  X, 
  Edit3,
  Upload,
  Image as ImageIcon,
  Trash2,
  Plus
} from 'lucide-react';
import { apiUpdateFranchiseeText, apiUpdateFranchiseeImages, apiRemoveFranchiseeImages } from '../../services/admin';
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
  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]); // Will store image URLs, not IDs
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Initialize form data when franchisee changes
  useEffect(() => {
    if (franchisee && isOpen) {
      console.log('Franchisee data:', franchisee); // Debug log
      console.log('Franchisee images:', franchisee.images); // Debug log
      
      setFormData({
        businessName: franchisee.businessName || '',
        locationAddress: franchisee.locationAddress || '',
        googleMapsLink: franchisee.googleMapsLink || '',
        contactNumber: franchisee.contactNumber || '',
        contactPerson: franchisee.contactPerson || '',
        description: franchisee.description || ''
      });
      
      // Handle different possible image data structures
      let images = [];
      if (franchisee.images) {
        if (Array.isArray(franchisee.images)) {
          images = franchisee.images;
        } else if (typeof franchisee.images === 'string') {
          // If images is a JSON string, parse it
          try {
            images = JSON.parse(franchisee.images);
          } catch (e) {
            console.error('Failed to parse images JSON:', e);
            images = [];
          }
        }
      }
      
      // Ensure each image has required properties
      images = images.map((img, index) => {
        if (typeof img === 'string') {
          // If image is just a URL string
          return {
            id: `img-${index}`,
            url: img
          };
        } else if (img && typeof img === 'object') {
          // If image is an object, ensure it has id and url
          return {
            id: img.id || `img-${index}`,
            url: img.url || img.src || img.path || img
          };
        }
        return null;
      }).filter(Boolean);
      
      console.log('Processed images:', images); // Debug log
      setCurrentImages(images);
      setNewImages([]);
      setImagesToDelete([]);
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
      setCurrentImages([]);
      setNewImages([]);
      setImagesToDelete([]);
      setErrors({});
      setIsLoading(false);
      setImageLoading(false);
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

  // Handle input changes
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    setErrors(prev => {
      if (prev[field]) {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      Swal.fire({
        title: 'Invalid File Type',
        text: 'Please select only JPEG, PNG, or WebP images.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    // Validate file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      Swal.fire({
        title: 'File Too Large',
        text: 'Each image must be smaller than 5MB.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    // Create preview URLs for new images
    const newImagePreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `new-${Date.now()}-${Math.random()}`
    }));

    setNewImages(prev => [...prev, ...newImagePreviews]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Remove new image
  const removeNewImage = useCallback((imageId) => {
    setNewImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      // Clean up object URL to prevent memory leaks
      const removedImage = prev.find(img => img.id === imageId);
      if (removedImage?.preview) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return updated;
    });
  }, []);

  // Mark existing image for deletion - FIXED: Now stores image URL instead of ID
  const markImageForDeletion = useCallback((imageId) => {
    console.log('Marking image for deletion:', imageId); // Debug log
    
    // Find the image by ID
    const imageToDelete = currentImages.find(img => (img.id || `img-${currentImages.indexOf(img)}`) === imageId);
    
    if (imageToDelete) {
      // Add the image URL to deletion list (not the ID)
      setImagesToDelete(prev => [...prev, imageToDelete.url]);
      // Remove from current images
      setCurrentImages(prev => prev.filter(img => (img.id || `img-${prev.indexOf(img)}`) !== imageId));
    }
  }, [currentImages]);

  // Restore image from deletion list - FIXED: Now works with URLs
  const restoreImage = useCallback((imageUrl) => {
    // Find the original image from franchisee data
    let originalImage = null;
    
    if (franchisee?.images) {
      let images = franchisee.images;
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images);
        } catch (e) {
          images = [];
        }
      }
      
      // Find the image by URL
      originalImage = images.find(img => {
        const url = typeof img === 'string' ? img : (img.url || img.src || img.path || img);
        return url === imageUrl;
      });
      
      // If found, convert to proper format
      if (originalImage) {
        const url = typeof originalImage === 'string' ? originalImage : (originalImage.url || originalImage.src || originalImage.path || originalImage);
        originalImage = {
          id: originalImage.id || `img-${Date.now()}`,
          url: url
        };
      }
    }
    
    if (originalImage) {
      setImagesToDelete(prev => prev.filter(url => url !== imageUrl));
      setCurrentImages(prev => [...prev, originalImage]);
    }
  }, [franchisee?.images]);

  // Handle image updates - FIXED: Now sends URLs array
  const handleImageUpdates = async () => {
    if (newImages.length === 0 && imagesToDelete.length === 0) {
      return; // No image changes
    }

    setImageLoading(true);
    
    try {
      // Upload new images if any
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((img, index) => {
          formData.append('images', img.file);
        });
        
        await apiUpdateFranchiseeImages(franchisee.id, formData);
      }

      // Delete images if any marked for deletion
      if (imagesToDelete.length > 0) {
        console.log('Deleting image URLs:', imagesToDelete); // Debug log
        await apiRemoveFranchiseeImages(franchisee.id, imagesToDelete);
      }
    } catch (error) {
      console.error('Image update error:', error);
      throw error; // Re-throw to be caught by handleSubmit
    } finally {
      setImageLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
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
      // Update text data
      const updatedTextData = await apiUpdateFranchiseeText(franchisee.id, formData);
      
      // Update images
      await handleImageUpdates();
      
      // Call success callback with updated data
      if (onSuccess) {
        onSuccess(franchisee.id, updatedTextData);
      }
      
      // Show success message
      await Swal.fire({
        title: 'Success!',
        text: 'Franchisee updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
        timer: 3000,
        timerProgressBar: true
      });
      
      // Clean up object URLs
      newImages.forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Update franchisee error:', error);
      
      await Swal.fire({
        title: 'Update Failed',
        text: error.response?.data?.message || error.message || 'Failed to update franchisee. Please try again.',
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
    if (!isLoading && !imageLoading) {
      // Clean up object URLs
      newImages.forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
      onClose();
    }
  }, [isLoading, imageLoading, newImages, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading && !imageLoading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, imageLoading, handleClose]);

  // Don't render if not open
  if (!isOpen) return null;

  // Show loading state if franchisee is null but modal should be open
  if (!franchisee) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <span className="text-gray-700">Loading franchisee data...</span>
        </div>
      </div>
    );
  }

  const totalImages = currentImages.length + newImages.length;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3">
              <Edit3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Franchisee</h2>
              <p className="text-sm text-gray-600">{franchisee?.businessName || 'Loading...'}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading || imageLoading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Franchisee Images
            </label>
            
            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {/* Existing Images */}
              {currentImages.map((image, index) => (
                <div key={image.id || `img-${index}`} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={image.url}
                      alt={`Franchisee image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onLoad={() => console.log('Image loaded:', image.url)}
                      onError={(e) => {
                        console.error('Image failed to load:', image.url);
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5QzEwLjM0MzEgOSA5IDEwLjM0MzEgOSAxMkM5IDEzLjY1NjkgMTAuMzQzMSAxNSAxMiAxNUMxMy42NTY5IDE1IDE1IDEzLjY1NjkgMTUgMTJDMTUgMTAuMzQzMSAxMy42NTY5IDkgMTIgOVoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTIxIDNINUM0LjQ0NzcyIDMgNCAzLjQ0NzcyIDQgNFYyMEM0IDIwLjU1MjMgNC40NDc3MiAyMSA1IDIxSDIxQzIxLjU1MjMgMjEgMjIgMjAuNTUyMyAyMiAyMFY0QzIyIDMuNDQ3NzIgMjEuNTUyMyAzIDIxIDNaTTUgNUgyMVYxNS41ODU4TDE4LjI5MjkgMTIuODc4N0MxNy45MDI0IDEyLjQ4ODIgMTcuMjY5MiAxMi40ODgyIDE2Ljg3ODcgMTIuODc4N0w5LjEyMTI2IDIwLjYzNjRDOS4wNDUwNCAyMC43MTI2IDguOTU0OTYgMjAuNzEyNiA4Ljg3ODc0IDIwLjYzNjRMNiAxNy43NTc3VjVaIiBmaWxsPSIjOUNBNEFGIi8+Cjwvc3ZnPgo=';
                        e.target.alt = 'Failed to load image';
                      }}
                    />
                  </div>
                  <button
                    onClick={() => markImageForDeletion(image.id || `img-${index}`)}
                    disabled={isLoading || imageLoading}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                    title="Delete image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                    {index + 1}
                  </div>
                </div>
              ))}

              {/* New Images */}
              {newImages.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-orange-200">
                    <img
                      src={image.preview}
                      alt="New upload"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs rounded">
                    New
                  </div>
                  <button
                    onClick={() => removeNewImage(image.id)}
                    disabled={isLoading || imageLoading}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Add Image Button */}
              {totalImages < 10 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
                >
                  <Plus className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 text-center">Add Image</span>
                </div>
              )}
            </div>

            {/* Upload Info */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{totalImages}/10 images • Existing: {currentImages.length} • New: {newImages.length}</span>
              <span>Max 5MB per image • JPEG, PNG, WebP</span>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading || imageLoading || totalImages >= 10}
            />

            {/* Images to Delete - FIXED: Now shows URLs properly */}
            {imagesToDelete.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 mb-2">
                  {imagesToDelete.length} image(s) will be deleted:
                </p>
                <div className="flex flex-wrap gap-2">
                  {imagesToDelete.map((imageUrl, index) => (
                    <button
                      key={imageUrl}
                      onClick={() => restoreImage(imageUrl)}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                      title={imageUrl}
                    >
                      Restore Image #{index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Text Fields */}
          <div className="grid md:grid-cols-2 gap-6">
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
                  disabled={isLoading || imageLoading}
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
                  disabled={isLoading || imageLoading}
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
                disabled={isLoading || imageLoading}
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
                disabled={isLoading || imageLoading}
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
                disabled={isLoading || imageLoading}
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isLoading || imageLoading}
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
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={isLoading || imageLoading}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || imageLoading}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              {isLoading || imageLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {imageLoading ? 'Updating Images...' : 'Updating...'}
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