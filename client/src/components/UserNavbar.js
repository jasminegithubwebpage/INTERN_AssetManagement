import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
 // Import the jwt-decode library
import { jwtDecode } from 'jwt-decode';
const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token to get user data
        setUserName(decoded.name); // Set the user's name from the decoded token
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, []); // Empty dependency array to run this effect once when the component loads

  const handleLogout = async () => {
    try {
      // Clear session and redirect
      localStorage.removeItem('token'); // Remove token from localStorage
      navigate('/users');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  return (
    <header className="bg-blue-700 shadow-md p-2 flex justify-between items-center text-white">
       <div className="flex items-center">
        <img
          src="/images/tvss_logo.jpg"
          alt="TVSSS Logo"
          className="h-10 w-10 mr-2"
        />
        <div className="text-xl font-semibold text-white">TVSSS</div>
      </div>
      <div className="flex items-center space-x-4">
        <span>Welcome, {userName || 'User'}</span> {/* Display name or fallback to 'User' */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
