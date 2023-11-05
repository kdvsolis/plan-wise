import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Dropdown } from 'bootstrap';

// Import your page components
import Header from './components/Header';

import Login from './pages/Login';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
// ... import the rest of your pages

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const isNotExpired = decoded.exp && decoded.exp > Date.now() / 1000;

      const dropdownElements = Array.from(document.querySelectorAll('.dropdown-toggle'));
      dropdownElements.map(dropdown => new Dropdown(dropdown));

      if (!isNotExpired) {
        localStorage.removeItem('token');
        setToken(null);
      }
    }
  }, [token]);

  const PrivateRoute = ({ children }) => {  
    const isAuthenticated = () => {
      if (!token) return false;
  
      const decoded = jwtDecode(token);
      const isNotExpired = decoded.exp && decoded.exp > Date.now() / 1000;
  
      return isNotExpired;
    };
  
    return isAuthenticated() ? children : <Navigate replace to="/login" />;
  };

  return (
    <div id="main">
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
          <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
          <Route path="/income" element={<PrivateRoute><Income /></PrivateRoute>} />
          {/* ... define the rest of your routes using PrivateRoute */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
