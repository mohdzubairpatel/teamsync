import { useEffect, useState } from "react";
import {
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaArrowRight
} from "react-icons/fa";

import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function Dashboard() {

  const [stats, setStats] = useState({
    total_teams: 0,
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0
  });

  const [loading, setLoading] = useState(true);

  const userName =
    localStorage.getItem("user_name") || "User";

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const response = await api.get(
        "/dashboard/"
      );

      console.log(
        "Dashboard Response:",
        response.data
      );

      setStats(response.data);

    } catch (error) {

      console.log(
        "Dashboard Error:",
        error.response?.data || error
      );

    } finally {

      setLoading(false);

    }

  };

  const cards = [
    {
      title: "Total Teams",
      value: stats.total_teams,
      icon: <FaUsers size={28} />,
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Total Tasks",
      value: stats.total_tasks,
      icon: <FaTasks size={28} />,
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "Completed Tasks",
      value: stats.completed_tasks,
      icon: <FaCheckCircle size={28} />,
      color: "from-green-500 to-green-700"
    },
    {
      title: "Pending Tasks",
      value: stats.pending_tasks,
      icon: <FaClock size={28} />,
      color: "from-red-500 to-red-700"
    }
  ];

  return (

    <DashboardLayout>

      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold">
            Welcome back, {userName} 👋
          </h1>

          <p className="text-slate-400 mt-2">
            Here's an overview of your TeamSync workspace.
          </p>

        </div>

      </div>

      {/* Stats Cards */}

      {loading ? (

        <div className="text-center py-10 text-xl">
          Loading Dashboard...
        </div>

      ) : (

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

          {cards.map((card, index) => (

            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300"
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-slate-400">
                    {card.title}
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    {card.value}
                  </h2>

                </div>

                <div
                  className={`bg-gradient-to-r ${card.color} p-4 rounded-xl`}
                >
                  {card.icon}
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Quick Actions */}

      <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <Link
            to="/teams"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <FaPlus />
            Create Team
          </Link>

          <Link
            to="/tasks"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <FaPlus />
            Create Task
          </Link>

          <Link
            to="/notifications"
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <FaArrowRight />
            View Notifications
          </Link>

        </div>

      </div>

      {/* Activity & Invitations */}

      <div className="grid lg:grid-cols-2 gap-6 mt-10">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-xl font-bold mb-4">
            Recent Activity
          </h2>

          <p className="text-slate-400">
            Activity tracking will appear here.
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-xl font-bold mb-4">
            Pending Invitations
          </h2>

          <p className="text-slate-400">
            Team invitations will appear here.
          </p>

        </div>

      </div>

    </DashboardLayout>

  );
}

export default Dashboard;