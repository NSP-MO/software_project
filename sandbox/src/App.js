import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const API_URL = 'http://localhost:5000/api';

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.email) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    }

    if (!isSignIn && !formData.name) {
      tempErrors.name = 'Name is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const endpoint = isSignIn ? '/signin' : '/signup';
      const payload = isSignIn ? 
        { email: formData.email, password: formData.password } :
        formData;

      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      
      if (isSignIn) {
        alert('Sign in successful!');
        // Here you would typically handle the authentication token
        // Example: localStorage.setItem('token', response.data.token);
      } else {
        alert('Sign up successful! Please sign in.');
        setIsSignIn(true); // Switch to sign in after successful registration
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Something went wrong';
      alert(errorMessage);
      console.error('API Error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <div className="auth-container">
      <div className={`form-container ${isSignIn ? 'sign-in' : 'sign-up'}`}>
        <h2>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isSignIn && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
          )}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <button type="submit" className="submit-btn">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="toggle-form">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsSignIn(!isSignIn)}>
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
        <div className="social-auth">
          <p>Or continue with</p>
          <div className="social-icons">
            <button className="social-btn google">
              <i className="fab fa-google"></i>
            </button>
            <button className="social-btn facebook">
              <i className="fab fa-facebook-f"></i>
            </button>
            <button className="social-btn github">
              <i className="fab fa-github"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;