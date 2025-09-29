import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import CodeEditor from './pages/CodeEditor';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import Navigation from './components/Navigation';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navigation />
          <main className="pt-4">
            <Routes>
              <Route path="/" element={<CodeEditor />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/challenges" element={<Challenges />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
