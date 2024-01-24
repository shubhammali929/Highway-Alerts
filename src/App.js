import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MyComponent from './components/MyComponent';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mycomponent" element={<MyComponent />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
