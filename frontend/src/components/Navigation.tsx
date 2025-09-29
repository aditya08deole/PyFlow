import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              PyFlow
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="hover:bg-blue-700 px-3 py-2 rounded transition-colors"
              >
                Code Editor
              </Link>
              <Link
                to="/dashboard"
                className="hover:bg-blue-700 px-3 py-2 rounded transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/challenges"
                className="hover:bg-blue-700 px-3 py-2 rounded transition-colors"
              >
                Challenges
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, Developer!</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;