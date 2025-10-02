import React from 'react';
import { Clock, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PendingApproval = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center pt-8 pb-6 px-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Pending</h1>
          <p className="text-gray-600">Your account is awaiting approval</p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 mb-1">
                  Account Under Review
                </h3>
                <p className="text-sm text-yellow-700">
                  Thank you for signing up with Google! Your account has been created successfully, 
                  but it requires approval from our admin team before you can access the platform.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  An admin will review your account details
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  You'll receive an email notification once approved
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  You can then log in and access your dashboard
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Need help?</h4>
              <p className="text-sm text-blue-700">
                If you have any questions or need to update your information, 
                please contact our support team at{' '}
                <a href="mailto: hello@potluck.africa" className="underline hover:no-underline">
              hello@potluck.africa
                </a>
              </p>
            </div>
          </div>

          {/* Back to Login */}
          <div className="mt-8">
            <Link 
              to="/login"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;