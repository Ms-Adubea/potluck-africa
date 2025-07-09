import React from 'react'

const RecentActivity = () => {
  return (
    <div>
         {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {currentData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <p className="text-gray-700">{activity}</p>
                  </div>
                ))}
              </div>
            </div>
    </div>
  )
};

export default RecentActivity;