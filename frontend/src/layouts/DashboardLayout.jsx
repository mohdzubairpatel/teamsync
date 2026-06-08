import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaTasks,
  FaBell,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

function DashboardLayout({ children }) {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 p-6">

        <h1 className="text-3xl font-bold mb-10">
          TeamSync
        </h1>

        <nav className="space-y-3">

          <Link
            to="/dashboard"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800"
          >
            <FaHome />
            Dashboard
          </Link>

          <Link
            to="/teams"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800"
          >
            <FaUsers />
            Teams
          </Link>

          <Link
            to="/tasks"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800"
          >
            <FaTasks />
            Tasks
          </Link>

          <Link
            to="/notifications"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800"
          >
            <FaBell />
            Notifications
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800"
          >
            <FaUser />
            Profile
          </Link>

        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 w-full flex items-center gap-3 p-3 bg-red-600 hover:bg-red-700 rounded-xl"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>

    </div>
  );
}

export default DashboardLayout;