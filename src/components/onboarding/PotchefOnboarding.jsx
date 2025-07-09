import React, { useState } from 'react';
import { Camera, Upload, MapPin, User, Phone, Mail, CreditCard, Check, ChefHat } from 'lucide-react';

const PotchefOnboarding = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePhoto: null,
    
    // Location
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Business Information
    businessName: '',
    businessType: 'home_kitchen',
    yearsExperience: '',
    specialties: [],
    
    // Certifications
    foodHandlingCert: null,
    businessLicense: null,
    
    // Kitchen Details
    kitchenDescription: '',
    servingCapacity: '',
    
    // Agreement
    termsAccepted: false,
    dataProcessingAccepted: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);

  const specialtyOptions = [
    'Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 
    'Indian', 'Thai', 'French', 'Vegan', 'Vegetarian', 
    'Gluten-Free', 'Desserts', 'BBQ', 'Seafood'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
      
      if (fieldName === 'profilePhoto') {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Profile submitted successfully! Welcome to Potluck!');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step < currentStep ? <Check className="w-4 h-4" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-orange-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <ChefHat className="w-16 h-16 mx-auto text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-600">Let's start with your basic details</p>
      </div>

      {/* Profile Photo Upload */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-orange-200">
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'profilePhoto')}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-2">Upload your profile photo</p>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="w-16 h-16 mx-auto text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Location & Address</h2>
        <p className="text-gray-600">Where will you be cooking from?</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="w-16 h-16 mx-auto text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
        <p className="text-gray-600">Tell us about your culinary background</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name (Optional)</label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="e.g., Maria's Kitchen"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
        <select
          name="businessType"
          value={formData.businessType}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="home_kitchen">Home Kitchen</option>
          <option value="catering">Catering Service</option>
          <option value="restaurant">Restaurant</option>
          <option value="food_truck">Food Truck</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
        <select
          name="yearsExperience"
          value={formData.yearsExperience}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        >
          <option value="">Select experience level</option>
          <option value="0-1">Less than 1 year</option>
          <option value="1-3">1-3 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5-10">5-10 years</option>
          <option value="10+">10+ years</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Specialties (Select all that apply)</label>
        <div className="grid grid-cols-2 gap-2">
          {specialtyOptions.map((specialty) => (
            <button
              key={specialty}
              type="button"
              onClick={() => handleSpecialtyToggle(specialty)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                formData.specialties.includes(specialty)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Serving Capacity</label>
        <select
          name="servingCapacity"
          value={formData.servingCapacity}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        >
          <option value="">Select capacity</option>
          <option value="1-10">1-10 meals</option>
          <option value="11-25">11-25 meals</option>
          <option value="26-50">26-50 meals</option>
          <option value="51-100">51-100 meals</option>
          <option value="100+">100+ meals</option>
        </select>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CreditCard className="w-16 h-16 mx-auto text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Certifications & Final Steps</h2>
        <p className="text-gray-600">Upload your certifications and agree to our terms</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Food Handling Certificate</label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <label className="cursor-pointer">
            <span className="text-sm text-gray-600">Click to upload certificate</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e, 'foodHandlingCert')}
              className="hidden"
            />
          </label>
          {formData.foodHandlingCert && (
            <p className="text-sm text-green-600 mt-2">✓ {formData.foodHandlingCert.name}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business License (Optional)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <label className="cursor-pointer">
            <span className="text-sm text-gray-600">Click to upload license</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e, 'businessLicense')}
              className="hidden"
            />
          </label>
          {formData.businessLicense && (
            <p className="text-sm text-green-600 mt-2">✓ {formData.businessLicense.name}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kitchen Description</label>
        <textarea
          name="kitchenDescription"
          value={formData.kitchenDescription}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Describe your kitchen setup, equipment, and cooking environment..."
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            className="mt-1 mr-3 h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            required
          />
          <label className="text-sm text-gray-700">
            I agree to the <a href="#" className="text-orange-500 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-500 hover:underline">Community Guidelines</a>
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            name="dataProcessingAccepted"
            checked={formData.dataProcessingAccepted}
            onChange={handleInputChange}
            className="mt-1 mr-3 h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            required
          />
          <label className="text-sm text-gray-700">
            I consent to the processing of my personal data as described in the <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
          </label>
        </div>
      </div>
    </div>
  );

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2:
        return formData.address && formData.city && formData.state && formData.zipCode;
      case 3:
        return formData.yearsExperience && formData.servingCapacity && formData.specialties.length > 0;
      case 4:
        return formData.termsAccepted && formData.dataProcessingAccepted;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Potluck!</h1>
            <p className="text-gray-600">Complete your chef profile to start sharing your delicious meals</p>
          </div>

          {renderStepIndicator()}

          <div>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-md font-medium ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-6 py-2 rounded-md font-medium ${
                    isStepValid()
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className={`px-6 py-2 rounded-md font-medium ${
                    isStepValid()
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Complete Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotchefOnboarding;