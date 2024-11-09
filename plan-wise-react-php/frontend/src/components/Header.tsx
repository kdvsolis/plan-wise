import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'

function Header() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [mediaQuery, setMediaQuery] = useState(window.matchMedia('(max-width: 992px)').matches);
  
    useEffect(() => {
      const handleResize = () => {
        setMediaQuery(window.matchMedia('(max-width: 992px)').matches);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      setToken(token);
    }, []);
  
    const signOut = () => {
      localStorage.removeItem('token');
      setToken(null);
      navigate('/login');
    };
  
    const ulStyle = () => {
        if (token) {
          return {
            visibility: 'visible'
          };
        } else {
          return mediaQuery ? { 
            display: 'none',
            marginTop: 10
          } : {
            visibility: 'hidden'
          };
        }
      };
      

  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div className="container-fluid">
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <a className="uui-navbar07_logo-link w-nav-brand" href="/">
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className="uui-logo_component">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="uui-logo_logomark">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <img src="/images/logomark-bg.svg" loading="eager" height="" alt="Untitled UI logomark" className="uui-styleguide_logomark-bg" />
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className="uui-logo_logomark-blur"></div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className="uui-logo_logomark-dot"></div>
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <p className="paragraph">Budget</p>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <img src="/images/untitled-ui-logo.png" loading="lazy" alt="Logo" className="uui-logo_image" />
          </div>
        </a>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <span className="navbar-toggler-icon"></span>
        </button>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <ul style={ulStyle()} className="navbar-nav me-auto mb-2 mb-lg-0" id="header-nav-list">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <li className="nav-item">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <a className="nav-link active" aria-current="page" href="/categories">Categories</a>
            </li>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <li className="nav-item">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <a className="nav-link" href="/expenses">Expenses</a>
            </li>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <li className="nav-item">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <a className="nav-link" href="/income">Income</a>
            </li>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <li className="nav-item dropdown">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Budget </a>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <ul className="dropdown-menu">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <li>
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <a className="uui-navbar07_dropdown-link" href="/budget-table">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="uui-navbar07_icon-wrapper">
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <div className="uui-icon-1x1-xsmall-2 w-embed">
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <path d="M20 19.5V16.5H7C5.34315 16.5 4 17.8431 4 19.5M8.8 22.5H16.8C17.9201 22.5 18.4802 22.5 18.908 22.282C19.2843 22.0903 19.5903 21.7843 19.782 21.408C20 20.9802 20 20.4201 20 19.3V5.7C20 4.57989 20 4.01984 19.782 3.59202C19.5903 3.21569 19.2843 2.90973 18.908 2.71799C18.4802 2.5 17.9201 2.5 16.8 2.5H8.8C7.11984 2.5 6.27976 2.5 5.63803 2.82698C5.07354 3.1146 4.6146 3.57354 4.32698 4.13803C4 4.77976 4 5.61984 4 7.3V17.7C4 19.3802 4 20.2202 4.32698 20.862C4.6146 21.4265 5.07354 21.8854 5.63803 22.173C6.27976 22.5 7.11984 22.5 8.8 22.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                      </div>
                    </div>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="uui-navbar07_item-right">
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <div className="uui-navbar07_item-heading">Budget Table</div>
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <div className="uui-text-size-small-2">View your budget in a table</div>
                    </div>
                  </a>
                </li>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <li>
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <a href="/budget-calendar" className="uui-navbar07_dropdown-link">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="uui-navbar07_icon-wrapper">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div className="uui-icon-1x1-xsmall-2 w-embed">
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <path d="M4.5 22.5V17.5M4.5 7.5V2.5M2 5H7M2 20H7M13 3.5L11.2658 8.00886C10.9838 8.74209 10.8428 9.10871 10.6235 9.41709C10.4292 9.6904 10.1904 9.92919 9.91709 10.1235C9.60871 10.3428 9.24209 10.4838 8.50886 10.7658L4 12.5L8.50886 14.2342C9.24209 14.5162 9.60871 14.6572 9.91709 14.8765C10.1904 15.0708 10.4292 15.3096 10.6235 15.5829C10.8428 15.8913 10.9838 16.2579 11.2658 16.9911L13 21.5L14.7342 16.9911C15.0162 16.2579 15.1572 15.8913 15.3765 15.5829C15.5708 15.3096 15.8096 15.0708 16.0829 14.8765C16.3913 14.6572 16.7579 14.5162 17.4911 14.2342L22 12.5L17.4911 10.7658C16.7579 10.4838 16.3913 10.3428 16.0829 10.1235C15.8096 9.92919 15.5708 9.6904 15.3765 9.41709C15.1572 9.10871 15.0162 8.74209 14.7342 8.00886L13 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </div>
                    </div>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="uui-navbar07_item-right">
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <div className="uui-navbar07_item-heading">Budget Calendar</div>
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <div className="uui-text-size-small-2">View your budget in a calendar</div>
                    </div>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          {!token ? (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="d-flex right-menu uui-navbar07_button-wrapper" id="header-login-register">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <a href="/login" className="uui-button-tertiary-gray">Log in</a>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <a href="/registration" className="uui-button-4 w-inline-block">Sign up</a>
            </div>
          ) : (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="d-flex right-menu uui-navbar07_button-wrapper" id="header-login-logout">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <button className="uui-button-4 w-inline-block" onClick={signOut}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
