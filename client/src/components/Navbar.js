import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../pages/UserContext';
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic (e.g., clear session data)
    navigate('/'); // Redirect to login page
  };
  // console.log(userName);
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
        <span>Welcome, {"Admin"}</span> {/* Display the username */}
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
