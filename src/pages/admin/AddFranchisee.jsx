import React, { useState } from 'react';
import { Building2, Loader2, Camera, X, MapPin, Phone, User, FileText, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/config';

const AddFranchisee = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    locationAddress: '',
    googleMapsLink: '',
    contactNumber: '',
    description: '',
    contactPerson: '',
    images: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.locationAddress.trim()) {
      newErrors.locationAddress = 'Location address is required';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.googleMapsLink && !isValidUrl(formData.googleMapsLink)) {
      newErrors.googleMapsLink = 'Please enter a valid Google Maps URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append('businessName', formData.businessName);
      formPayload.append('locationAddress', formData.locationAddress);
      formPayload.append('contactNumber', formData.contactNumber);
      formPayload.append('contactPerson', formData.contactPerson);
      formPayload.append('description', formData.description);
      
      if (formData.googleMapsLink) {
        formPayload.append('googleMapsLink', formData.googleMapsLink);
      }
      
      // Append all images
      formData.images.forEach((image) => {
        formPayload.append('images', image);
      });

      // Call the franchisee API endpoint
      const response = await apiClient.post('/franchisees', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert('Franchisee added successfully!');
      navigate('/dashboard/admin/users'); // Assuming you'll have a franchisees list page
    } catch (error) {
      console.error('Add franchisee error:', error);
      alert(error.response?.data?.message || 'Failed to add franchisee. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Check total number of images
    if (formData.images.length + validFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, ...validFiles] 
    }));
    
    // Create previews for new images
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          file,
          url: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center pt-8 pb-6 px-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Franchisee</h1>
          <p className="text-gray-600">Create a new franchisee location</p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <div className="space-y-5">
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Franchisee Images (Optional)
              </label>
              <div className="space-y-4">
                {/* Upload Button */}
                <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB (Max 5 images)</p>
                  </div>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="businessName"
                  type="text"
                  placeholder="Potluck Eatery"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.businessName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>}
            </div>

            {/* Location Address */}
            <div>
              <label htmlFor="locationAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Location Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <textarea
                  id="locationAddress"
                  placeholder="Accra Mall, Ghana"
                  value={formData.locationAddress}
                  onChange={(e) => handleInputChange('locationAddress', e.target.value)}
                  rows={3}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none ${
                    errors.locationAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.locationAddress && <p className="mt-1 text-sm text-red-600">{errors.locationAddress}</p>}
            </div>

            {/* Google Maps Link */}
            <div>
              <label htmlFor="googleMapsLink" className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Link (Optional)
              </label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="googleMapsLink"
                  type="url"
                  placeholder="https://maps.app.goo.gl/xBiSTK5zDFhHsayM7"
                  value={formData.googleMapsLink}
                  onChange={(e) => handleInputChange('googleMapsLink', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.googleMapsLink ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.googleMapsLink && <p className="mt-1 text-sm text-red-600">{errors.googleMapsLink}</p>}
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="contactNumber"
                  type="tel"
                  placeholder="0243456789"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.contactNumber && <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>}
            </div>

            {/* Contact Person */}
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="contactPerson"
                  type="text"
                  placeholder="Kojos"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.contactPerson && <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="description"
                  placeholder="A cozy walk-in location to enjoy Potluck meals."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding franchisee...
                </div>
              ) : (
                'Add Franchisee'
              )}
            </button>
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Link to="/dashboard/admin">
                <button className="text-orange-500 hover:text-orange-600 font-medium hover:underline transition-colors">
                  ← Back to Admin Dashboard
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFranchisee;