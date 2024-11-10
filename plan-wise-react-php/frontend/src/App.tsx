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
import BudgetCalendar from './pages/BudgetCalendar';
import BudgetTable from './pages/BudgetTable';

// Using 'any' for general flexibility
interface PrivateRouteProps {
  children: any;
}

function App() {
  const [token, setToken] = useState<any>(localStorage.getItem('token')); // Token as 'any'

  useEffect(() => {
    if (token) {
      const decoded: any = jwtDecode(token); // Decode as 'any'
      const isNotExpired = decoded.exp && decoded.exp > Date.now() / 1000;

      const dropdownElements = Array.from(document.querySelectorAll('.dropdown-toggle'));
      dropdownElements.map((dropdown: any) => new Dropdown(dropdown)); // Initialize dropdowns

      if (!isNotExpired) {
        localStorage.removeItem('token');
        setToken(null);
      }
    }
  }, [token]);

  // PrivateRoute component with 'any' type for children
  const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {  
    const isAuthenticated = () => {
      if (!token) return false;

      const decoded: any = jwtDecode(token); // Decode as 'any'
      const isNotExpired = decoded.exp && decoded.exp > Date.now() / 1000;

      return isNotExpired;
    };

    return isAuthenticated() ? <>{children}</> : <Navigate replace to="/login" />;
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
          <Route path="/budget-table" element={<PrivateRoute><BudgetTable /></PrivateRoute>} />
          <Route path="/budget-calendar" element={<PrivateRoute><BudgetCalendar /></PrivateRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
