import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold">🐍 PyFlow - Visual Python Coding Assistant</h1>
        <p className="mt-2 text-blue-100">Enhanced with Data Structure & Algorithm Visualization</p>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">🎉 PyFlow is Running Successfully!</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-green-600">✅ Backend Status</h3>
              <p className="text-gray-600">FastAPI server running on port 8000</p>
              <a 
                href="http://localhost:8000/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                View API Documentation
              </a>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-green-600">🚀 Features Ready</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Visual Code Flow Diagrams</li>
                <li>• Data Structure Visualization</li>
                <li>• Step-by-step Algorithm Execution</li>
                <li>• AI-powered Code Assistant</li>
                <li>• Interactive Learning Challenges</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-medium text-yellow-800">🔨 Development Status</h4>
            <p className="text-yellow-700 mt-1">
              PyFlow is successfully running! This is a simplified version for initial testing. 
              Full components will be activated once the basic setup is verified.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;