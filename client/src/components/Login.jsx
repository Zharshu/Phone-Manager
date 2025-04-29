import './Login.css';
import React, { useState } from 'react';
import { loginUser, signupUser, setAuthToken } from '../services/api';
import './Login.css';
import './Contacts.css';

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignup) {
        const response = await signupUser(form);
        const { token, user } = response.data;
        setAuthToken(token);
        onLogin({ ...user, token });
      } else {
        const response = await loginUser({ email: form.email, password: form.password });
        const { token, user } = response.data;
        setAuthToken(token);
        onLogin({ ...user, token });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          {isSignup && (
            <div>
              <label htmlFor="name" className="login-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="login-input"
                placeholder="John Doe"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="login-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="login-input"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="login-input"
              placeholder="********"
              required
            />
          </div>
          <button type="submit" className="login-button">
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <p className="login-toggle">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setError('');
              setIsSignup(!isSignup);
            }}
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
