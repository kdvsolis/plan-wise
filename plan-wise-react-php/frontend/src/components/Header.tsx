import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [mediaQuery, setMediaQuery] = useState(window.matchMedia('(max-width: 992px)').matches);
  
    useEffect(() => {
      const handleResize = () => setMediaQuery(window.matchMedia('(max-width: 992px)').matches);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    useEffect(() => {
      setToken(localStorage.getItem('token'));
    }, []);
  
    const signOut = () => {
      localStorage.removeItem('token');
      setToken(null);
      navigate('/login');
    };
  
    const ulStyle = () => {
      if (token) {
          return { visibility: 'visible' as 'visible' | 'hidden' };  // type assertion
      } else {
          return mediaQuery
              ? { display: 'none', marginTop: 10 }
              : { visibility: 'hidden' as 'visible' | 'hidden' };  // type assertion
      }
    };
  

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="uui-navbar07_logo-link w-nav-brand" href="/">
                    <div className="uui-logo_component">
                        <div className="uui-logo_logomark">
                            <img src="/images/logomark-bg.svg" alt="Logo" className="uui-styleguide_logomark-bg" />
                            <div className="uui-logo_logomark-blur"></div>
                            <div className="uui-logo_logomark-dot"></div>
                        </div>
                        <p className="paragraph">Budget</p>
                        <img src="/images/untitled-ui-logo.png" alt="Logo" className="uui-logo_image" />
                    </div>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-expanded="false">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul style={ulStyle()} className="navbar-nav me-auto mb-2 mb-lg-0" id="header-nav-list">
                        <li className="nav-item"><a className="nav-link active" href="/categories">Categories</a></li>
                        <li className="nav-item"><a className="nav-link" href="/expenses">Expenses</a></li>
                        <li className="nav-item"><a className="nav-link" href="/income">Income</a></li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"> Budget </a>
                            <ul className="dropdown-menu">
                                <li><a className="uui-navbar07_dropdown-link" href="/budget-table">Budget Table</a></li>
                                <li><a className="uui-navbar07_dropdown-link" href="/budget-calendar">Budget Calendar</a></li>
                            </ul>
                        </li>
                    </ul>
                    {!token ? (
                        <div className="d-flex right-menu uui-navbar07_button-wrapper">
                            <a href="/login" className="uui-button-tertiary-gray">Log in</a>
                            <a href="/registration" className="uui-button-4 w-inline-block">Sign up</a>
                        </div>
                    ) : (
                        <div className="d-flex right-menu uui-navbar07_button-wrapper">
                            <button className="uui-button-4 w-inline-block" onClick={signOut}>Sign out</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header;
