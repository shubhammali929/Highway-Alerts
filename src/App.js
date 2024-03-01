import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MyComponent from './components/MyComponent';
import { MyProvider } from './context/MyContext';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mycomponent" element={<MyProvider><MyComponent /></MyProvider>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
