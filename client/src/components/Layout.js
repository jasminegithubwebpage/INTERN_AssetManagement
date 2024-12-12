import React from "react";
import Navbar from "./Navbar";
import SideBar from "./SideBar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar />
      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
