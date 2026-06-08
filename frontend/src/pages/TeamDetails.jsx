import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaUsers,
  FaUserShield,
  FaUser,
  FaClipboardList,
} from "react-icons/fa";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function TeamDetails() {
  const { teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await api.get(`/teams/${teamId}`);

      setTeam(response.data);

      localStorage.setItem(
        "selected_team_id",
        response.data.id
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center text-xl">
          Loading Team Details...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Team Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold">
              {team.team_name}
            </h1>

            <p className="text-slate-400 mt-3">
              {team.description ||
                "No description available"}
            </p>

            <div className="flex gap-3 mt-5">
              <span className="bg-green-600 px-4 py-1 rounded-full text-sm">
                {team.status}
              </span>

              <span className="bg-slate-800 px-4 py-1 rounded-full text-sm">
                Team ID: {team.id}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/team-requests"
              className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl flex items-center gap-2"
            >
              <FaClipboardList />
              Join Requests
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-slate-400">
                Total Members
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {team.members?.length || 0}
              </h2>
            </div>

            <FaUsers
              size={32}
              className="text-blue-400"
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-slate-400">
                Team Status
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {team.status}
              </h2>
            </div>

            <FaUserShield
              size={32}
              className="text-green-400"
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-slate-400">
                Leader
              </p>

              <h2 className="text-sm mt-2 break-all">
                {team.leader_id}
              </h2>
            </div>

            <FaUser
              size={32}
              className="text-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          Team Members
        </h2>

        {team.members?.length === 0 ? (
          <div className="text-slate-400">
            No members found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3">
                    User ID
                  </th>

                  <th className="text-left py-3">
                    Role
                  </th>
                </tr>
              </thead>

              <tbody>
                {team.members?.map(
                  (member, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-800"
                    >
                      <td className="py-4">
                        {member.user_id}
                      </td>

                      <td className="py-4">
                        <span
                          className={
                            member.role === "leader"
                              ? "bg-yellow-600 px-3 py-1 rounded-full text-sm"
                              : "bg-blue-600 px-3 py-1 rounded-full text-sm"
                          }
                        >
                          {member.role}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default TeamDetails;