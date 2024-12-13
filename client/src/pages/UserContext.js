import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginTime, setLoginTime] = useState(null);

  const login = (userData) => {
    setUser(userData);
    setLoginTime(new Date().toISOString()); // Save login time
  };

  const logout = () => {
    setUser(null);
    setLoginTime(null);
  };

  return (
    <UserContext.Provider value={{ user,setUser, loginTime, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
