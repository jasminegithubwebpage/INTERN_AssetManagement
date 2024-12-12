import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate(); // Use navigate inside the component

  const handleLogout = () => {
    // Perform any logout logic (clear user data, tokens, etc.)
    // Example: localStorage.removeItem('userToken');

    // Redirect to login page
    navigate('/'); // This will redirect to the login page
  };

  return (
    <header className="bg-blue-700 shadow-md p-2 flex justify-between items-center text-white">
      <div className="text-xl font-semibold text-white-800">TVSSS</div>
      <div className="flex items-center space-x-4">
        <span>Welcome, User</span>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleLogout} // Use function reference, not function call
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
