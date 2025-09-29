import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Learning Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Code Sessions</h3>
          <p className="text-3xl font-bold text-blue-600">23</p>
          <p className="text-sm text-gray-500">This week</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Challenges Completed</h3>
          <p className="text-3xl font-bold text-green-600">7</p>
          <p className="text-sm text-gray-500">Out of 15</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Learning Streak</h3>
          <p className="text-3xl font-bold text-purple-600">5</p>
          <p className="text-sm text-gray-500">Days</p>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm">Completed "Factorial Function" challenge</span>
              <span className="ml-auto text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm">Practiced loop visualization</span>
              <span className="ml-auto text-xs text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm">Used AI assistant for debugging</span>
              <span className="ml-auto text-xs text-gray-500">2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;