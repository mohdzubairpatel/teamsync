import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function ExploreTeams() {

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {

    try {

      const response = await api.get(
        "/teams/all"
      );

      setTeams(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  const sendRequest = async (teamId) => {

    try {

      await api.post(
        `/team-requests/send/${teamId}`
      );

      alert(
        "Join request sent successfully"
      );

    } catch (error) {

      alert(
        error.response?.data?.message
      );

    }

  };

  return (

    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Explore Teams
        </h1>

        <p className="text-slate-400 mt-2">
          Discover teams and join projects
        </p>

      </div>

      {loading ? (

        <div>Loading Teams...</div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {teams.map((team) => (

            <div
              key={team.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >

              <FaUsers
                size={40}
                className="text-blue-500 mb-4"
              />

              <h2 className="text-xl font-bold">
                {team.team_name}
              </h2>

              <p className="text-slate-400 mt-3">
                {team.description}
              </p>

              <button
                onClick={() =>
                  sendRequest(team.id)
                }
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl"
              >
                Request to Join
              </button>

            </div>

          ))}

        </div>

      )}

    </DashboardLayout>

  );
}

export default ExploreTeams;