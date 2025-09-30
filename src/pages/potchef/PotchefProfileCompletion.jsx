import React, { useState, useEffect } from 'react';
import { ChefHat, Loader2, Building2, CreditCard, CheckCircle, AlertCircle, ArrowRight, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiGetBanks, apiCompleteProfile } from '../../services/potchef';
import { isTempTokenValid } from '../../services/auth';

const PotchefProfileCompletion = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [bankSearchTerm, setBankSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    payoutDetails: {
      type: 'bank',
      bank: {
        bankCode: '',
        accountNumber: '',
        accountName: ''
      }
    }
  });

  const [selectedBank, setSelectedBank] = useState(null);
  const [showBankList, setShowBankList] = useState(false);

  // Load banks on component mount and verify temp token
  useEffect(() => {
    // First check if temp token is valid
    if (!isTempTokenValid()) {
      console.log('No valid temp token found, redirecting to login');
      navigate('/login');
      return;
    }

    const fetchBanks = async () => {
      try {
        const response = await apiGetBanks();
        const bankList = response.data?.data || response.data || [];
        
        // Filter only GHS banks and active banks
        const ghsBanks = bankList.filter(bank => 
          bank.currency === 'GHS' && 
          bank.active && 
          !bank.is_deleted &&
          bank.supports_transfer
        );
        
        setBanks(ghsBanks);
        setFilteredBanks(ghsBanks);
      } catch (error) {
        console.error('Error fetching banks:', error);
        
        // Check if it's an auth error
        if (error.response?.status === 401) {
          console.log('Unauthorized access, temp token may be invalid');
          localStorage.removeItem('tempToken');
          navigate('/login');
        } else {
          setErrors({ general: 'Failed to load banks. Please refresh the page.' });
        }
      }
    };

    fetchBanks();
  }, [navigate]);

  // Filter banks based on search term
  useEffect(() => {
    if (bankSearchTerm) {
      const filtered = banks.filter(bank =>
        bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase())
      );
      setFilteredBanks(filtered);
    } else {
      setFilteredBanks(banks);
    }
  }, [bankSearchTerm, banks]);

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.payoutDetails.bank.bankCode) {
      newErrors.bank = 'Please select a bank';
    }
    
    if (!formData.payoutDetails.bank.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d+$/.test(formData.payoutDetails.bank.accountNumber)) {
      newErrors.accountNumber = 'Account number should contain only numbers';
    }
    
    if (!formData.payoutDetails.bank.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('bank.')) {
      const bankField = field.replace('bank.', '');
      setFormData(prev => ({
        ...prev,
        payoutDetails: {
          ...prev.payoutDetails,
          bank: {
            ...prev.payoutDetails.bank,
            [bankField]: value
          }
        }
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field] || errors[field.replace('bank.', '')]) {
      setErrors(prev => ({ 
        ...prev, 
        [field]: '',
        [field.replace('bank.', '')]: ''
      }));
    }
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setFormData(prev => ({
      ...prev,
      payoutDetails: {
        ...prev.payoutDetails,
        bank: {
          ...prev.payoutDetails.bank,
          bankCode: bank.code
        }
      }
    }));
    setShowBankList(false);
    setBankSearchTerm('');
    
    // Clear bank error
    if (errors.bank) {
      setErrors(prev => ({ ...prev, bank: '' }));
    }
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep1()) return;

    setIsLoading(true);

    try {
      const response = await apiCompleteProfile(formData);
      
      // Clear temp token and redirect to success
      localStorage.removeItem('tempToken');
      
      // Store updated user data
      if (response.user) {
        localStorage.setItem('profileCompleted', 'true');
      }

      setStep(3); // Success step
    } catch (error) {
      console.error('Profile completion error:', error);
      
      // Check if it's an auth error
      if (error.response?.status === 401) {
        console.log('Unauthorized access during profile completion');
        localStorage.removeItem('tempToken');
        navigate('/login');
      } else {
        setErrors({ 
          general: error.response?.data?.message || 'Bank account verification failed. Please check your bank details.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center pt-8 pb-6 px-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
              <Link to="/">
                <ChefHat className="h-8 w-8 text-white" />
              </Link>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Chef Profile</h1>
          <p className="text-gray-600">Add your payout details to start earning from your meals</p>
        </div>

        {/* Progress Bar */}
        <div className="px-8 mb-6">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span className={step >= 1 ? 'text-orange-500 font-medium' : ''}>Bank Details</span>
            <span className={step >= 2 ? 'text-orange-500 font-medium' : ''}>Review</span>
            <span className={step >= 3 ? 'text-orange-500 font-medium' : ''}>Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Step 1: Bank Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Account Details</h3>
                
                {/* Bank Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowBankList(!showBankList)}
                      className={`w-full px-4 py-3 text-left border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                        errors.bank ? 'border-red-500' : 'border-gray-300'
                      } ${selectedBank ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                        <span className={selectedBank ? 'text-gray-900' : 'text-gray-500'}>
                          {selectedBank ? selectedBank.name : 'Choose your bank'}
                        </span>
                      </div>
                    </button>
                    
                    {showBankList && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                        {/* Search */}
                        <div className="p-3 border-b">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search banks..."
                              value={bankSearchTerm}
                              onChange={(e) => setBankSearchTerm(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                        </div>
                        
                        {/* Bank List */}
                        <div className="max-h-40 overflow-y-auto">
                          {filteredBanks.length > 0 ? (
                            filteredBanks.map((bank) => (
                              <button
                                key={bank.id}
                                type="button"
                                onClick={() => handleBankSelect(bank)}
                                className="w-full px-4 py-3 text-left hover:bg-orange-50 focus:bg-orange-50 focus:outline-none transition-colors border-b last:border-b-0"
                              >
                                <div className="text-sm font-medium text-gray-900">{bank.name}</div>
                                <div className="text-xs text-gray-500">{bank.code}</div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              No banks found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.bank && <p className="mt-1 text-sm text-red-600">{errors.bank}</p>}
                </div>

                {/* Account Number */}
                <div className="mb-4">
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="accountNumber"
                      type="text"
                      placeholder="Enter your account number"
                      value={formData.payoutDetails.bank.accountNumber}
                      onChange={(e) => handleInputChange('bank.accountNumber', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                        errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>}
                </div>

                {/* Account Name */}
                <div className="mb-6">
                  <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name
                  </label>
                  <input
                    id="accountName"
                    type="text"
                    placeholder="Account holder full name"
                    value={formData.payoutDetails.bank.accountName}
                    onChange={(e) => handleInputChange('bank.accountName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 bg-orange-50 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      errors.accountName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.accountName && <p className="mt-1 text-sm text-red-600">{errors.accountName}</p>}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center"
              >
                Review Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Details</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Bank:</span>
                    <p className="font-medium">{selectedBank?.name}</p>
                  </div>
                  
                  <hr />
                  
                  <div>
                    <span className="text-sm text-gray-600">Account Number:</span>
                    <p className="font-medium">{formData.payoutDetails.bank.accountNumber}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Account Name:</span>
                    <p className="font-medium">{formData.payoutDetails.bank.accountName}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </div>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Completed Successfully!</h3>
                <p className="text-gray-600 mb-4">
                  Your chef profile has been submitted for admin approval. You'll be notified once approved and can start selling your meals.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">What's Next?</p>
                      <ul className="mt-2 list-disc list-inside space-y-1">
                        <li>Admin will review your application</li>
                        <li>You'll receive an email notification upon approval</li>
                        <li>Once approved, you can login and start adding meals</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLoginRedirect}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PotchefProfileCompletion;