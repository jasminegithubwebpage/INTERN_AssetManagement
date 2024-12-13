import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../pages/UserContext';
import axiosInstance from '../axiosInstance';
const Navbar = () => {
  const navigate = useNavigate();
  const { user, loginTime, logout } = useUser();
  console.log(user);
  const handleLogout = async () => {
    try {
      await axiosInstance('/user/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          username: user.name,
          loginTime: loginTime,
        }),
      });

      // Clear session and redirect
      logout();
      navigate('/users');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  return (
    <header className="bg-blue-700 shadow-md p-2 flex justify-between items-center text-white">
      <div className="text-xl font-semibold">TVSSS</div>
      <div className="flex items-center space-x-4">
      <span>Welcome, {user || 'Guest'}</span>
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
