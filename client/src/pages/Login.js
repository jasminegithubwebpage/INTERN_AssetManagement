import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Correct axios import
import Navbar from '../components/Navbar';
const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error message

  const validate = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required.';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        // Axios POST request to login API
        const response = await axios.post('http://localhost:3001/login', formData);

        // On successful login, navigate to the assets page
        if (response.status === 200) {
          console.log('Login successful:', response.data);
          navigate('/assets');
        }
      } catch (err) {
        // Handle errors from the backend, e.g., invalid credentials
        if (err.response) {
          setErrorMessage(err.response.data.message || 'An error occurred. Please try again.');
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <>
      <Navbar />
    <div className="bg-blue-800 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.username ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-400'
              }`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-400'
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>
        {errorMessage && <p className="text-red-500 text-sm mt-4 text-center">{errorMessage}</p>}
      </div>
    </div>
    </>
  );
};

export default Login;
