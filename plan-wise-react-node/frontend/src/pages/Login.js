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

  const submitForm = async (event) => {
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
    <div className="container w-container">
      <div className="form-wrapper">
        <div className="w-form">
          <form id="wf-form-signup" onSubmit={submitForm}>
            <h1 className="heading">Login</h1>
            <div>
              <label htmlFor="email" className="field-label-2">Email</label>
              <input 
                type="email" 
                className="text-field w-input" 
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
            <div>
              <label htmlFor="password-2" className="field-label">Password</label>
              <input 
                type="password" 
                className="text-field-2 w-input" 
                maxLength="256" 
                placeholder="" 
                id="password-2" 
                data-ms-member="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="relative w-clearfix">
              <a href="#" className="forgot-password-link">Forgot password</a>
            </div>
            <button className="uui-button-4 button-width w-button">Login</button>
            <div>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
            </div>
          </form>
        </div>
        <div>
          <div className="text-block-2">Need an account? <a href="/registration">Sign up</a></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
