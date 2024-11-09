import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import account from '../services/account-service';
import { storageHandler } from '../utils/storage_handler';
import '../assets/components.css';
import '../assets/budgeting-app.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(storageHandler.localStorageGet('token'));

  
  useEffect(() => {
    if (token) {
        navigate('/');
    }
  }, [token]);

  const submitForm = async (event: any) => {
    event.preventDefault();

    const response = await account.login({ username, password });
    if (response.success) {
        storageHandler.localStorageSet("token", response.token);
        setToken(response.token);
        navigate('/');
    } else {
        setError(response.message);
    }
  };

  return (
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <div className="container w-container">
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <div className="form-wrapper">
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className="w-form">
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <form id="wf-form-signup" onSubmit={submitForm}>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <h1 className="heading">Login</h1>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <label htmlFor="email" className="field-label-2">Email</label>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <input 
                type="email" 
                className="text-field w-input" 
                // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
                maxLength="256" 
                name="email" 
                data-name="email" 
                placeholder="e.g. howard.thurman@gmail.com" 
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <label htmlFor="password-2" className="field-label">Password</label>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <input 
                type="password" 
                className="text-field-2 w-input" 
                // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
                maxLength="256" 
                placeholder="" 
                id="password-2" 
                data-ms-member="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="relative w-clearfix">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <a href="#" className="forgot-password-link">Forgot password</a>
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <button className="uui-button-4 button-width w-button">Login</button>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
            </div>
          </form>
        </div>
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className="text-block-2">Need an account? <a href="/registration">Sign up</a></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
