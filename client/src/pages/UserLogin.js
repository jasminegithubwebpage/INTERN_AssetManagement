import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import axiosInstance from "../axiosInstance";
import { useUser } from "./UserContext";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await axiosInstance.post("/user/login", formData);
        if (response.data.status === "1") {
          const { token } = response.data; // Receive JWT token from backend
          localStorage.setItem("token", token); // Store token securely in localStorage
         
          setUser(response.data.name); // Save user context
          console.log("Login successful:", response.data);
          console.log("Stored Token:", localStorage.getItem("token")); 

          navigate("/users/issues"); // Secure navigation without employee ID
        } else {
          setErrorMessage(response.data.message || "Invalid credentials.");
        }
      } catch (err) {
        console.error("Error:", err.message);
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="bg-blue-800 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">User Login</h2>
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              Login
            </button>
          </form>
          {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}
        </div>
      </div>
    </>
  );
};

export default UserLogin;
