// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem('currentUser')) || null;
  });
  const [loginTime, setLoginTime] = useState(() => {
    return sessionStorage.getItem('loginTime') || null;
  });
  

  const login = (userData) => {
    console.log('User logged in:', userData);
    setUser(userData);
  
    const currentLoginTime = new Date().toISOString();
    setLoginTime(currentLoginTime);
  
    // Save to sessionStorage instead of localStorage
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    sessionStorage.setItem('loginTime', currentLoginTime);
  };
  
  const logout = () => {
    setUser(null);
    setLoginTime(null);
  
    // Clear sessionStorage
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('loginTime');
  };
  

  return (
    <UserContext.Provider value={{ user, setUser, loginTime, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
