import { Link } from "react-router-dom";
import { useState } from "react";

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-10" : "w-40"
      } bg-blue-800 text-white text-sm min-h-screen p-4 transition-all duration-300 ease-in-out`}
    >
      {/* Toggle Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`${isCollapsed ? "hidden" : "block"} text-1xl`}>
          Asset Management
        </h1>
        <button
          onClick={toggleSidebar}
          className="bg-white-700 p-1 rounded hover:bg-white-600"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? "➤" : "◀"} {/* Shrink/Expand Icon */}
        </button>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul>
          <li>
            <Link
              to="/assets"
              className={`block py-2 px-1 hover:bg-blue-700 ${
                isCollapsed ? "text-center" : ""
              }`}
            >
              {isCollapsed ? "📋" : "Assets List"}
            </Link>
          </li>
          <li>
            <Link
              to="/asset-issues"
              className={`block py-2 px-1 hover:bg-blue-700 ${
                isCollapsed ? "text-center" : ""
              }`}
            >
              {isCollapsed ? "📦" :"Asset Issues"}
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              className={`block py-2 px-1 hover:bg-blue-700 ${
                isCollapsed ? "text-center" : ""
              }`}
            >
              {isCollapsed ? "📊" : "Reports"}
            </Link>
          </li>
          <li>
            <Link
              to="/messages"
              className={`block py-2 px-1 hover:bg-blue-700 ${
                isCollapsed ? "text-center" : ""
              }`}
            >
              {isCollapsed ? "✉️" : "Messages"}
            </Link>
          </li>
          <li>
            <Link
              to="/customers"
              className={`block py-2 px-1 hover:bg-blue-700 ${
                isCollapsed ? "text-center" : ""
              }`}
            >
              {isCollapsed ? "👤" : "Customers"}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
