import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'boot... Remove this comment to see the full error message
import { Dropdown } from 'bootstrap';

// Import your page components
// @ts-expect-error TS(6142): Module './components/Header' was resolved to '/mnt... Remove this comment to see the full error message
import Header from './components/Header';

// @ts-expect-error TS(6142): Module './pages/Login' was resolved to '/mnt/d/Arc... Remove this comment to see the full error message
import Login from './pages/Login';
// @ts-expect-error TS(6142): Module './pages/Home' was resolved to '/mnt/d/Arch... Remove this comment to see the full error message
import Home from './pages/Home';
// @ts-expect-error TS(6142): Module './pages/Categories' was resolved to '/mnt/... Remove this comment to see the full error message
import Categories from './pages/Categories';
// @ts-expect-error TS(6142): Module './pages/Expenses' was resolved to '/mnt/d/... Remove this comment to see the full error message
import Expenses from './pages/Expenses';
// @ts-expect-error TS(6142): Module './pages/Income' was resolved to '/mnt/d/Ar... Remove this comment to see the full error message
import Income from './pages/Income';
// @ts-expect-error TS(6142): Module './pages/BudgetCalendar' was resolved to '/... Remove this comment to see the full error message
import BudgetCalendar from './pages/BudgetCalendar';
// @ts-expect-error TS(6142): Module './pages/BudgetTable' was resolved to '/mnt... Remove this comment to see the full error message
import BudgetTable from './pages/BudgetTable';
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

  const PrivateRoute = ({
    children
  }: any) => {  
    const isAuthenticated = () => {
      if (!token) return false;
  
      const decoded = jwtDecode(token);
      const isNotExpired = decoded.exp && decoded.exp > Date.now() / 1000;
  
      return isNotExpired;
    };
  
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return isAuthenticated() ? children : <Navigate replace to="/login" />;
  };

  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <div id="main">
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <Router>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Header />
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Routes>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <Route path="/login" element={<Login />} />
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <Route path="/income" element={<PrivateRoute><Income /></PrivateRoute>} />
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <Route path="/budget-table" element={<PrivateRoute><BudgetTable /></PrivateRoute>} />
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <Route path="/budget-calendar" element={<PrivateRoute><BudgetCalendar /></PrivateRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
