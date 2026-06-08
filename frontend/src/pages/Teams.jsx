import { useEffect, useState } from "react";
import { FaUsers, FaPlus, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function Teams() {

  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");

  const [teamData, setTeamData] = useState({
    team_name: "",
    description: ""
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {

    const filtered = teams.filter((team) =>
      team.team_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredTeams(filtered);

  }, [search, teams]);

  const fetchTeams = async () => {

    try {

      const response = await api.get(
        "/teams/my-teams"
      );

      console.log(
        "TEAMS DATA:",
        response.data
      );

      setTeams(response.data);
      setFilteredTeams(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const createTeam = async (e) => {

    e.preventDefault();

    try {

      setCreating(true);

      await api.post(
        "/teams/create",
        teamData
      );

      setTeamData({
        team_name: "",
        description: ""
      });

      setShowModal(false);

      fetchTeams();

    } catch (error) {

      console.log(error);

      alert("Failed to create team");

    } finally {

      setCreating(false);

    }

  };

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-8 gap-4">

        <div>

          <h1 className="text-4xl font-bold">
            Teams
          </h1>

          <p className="text-slate-400 mt-2">
            Manage all your teams in one place
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <FaPlus />
          Create Team
        </button>

      </div>

      {/* Search + Count */}

      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-4 flex-1">

          <FaSearch className="text-slate-400" />

          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="bg-transparent p-4 w-full outline-none"
          />

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl px-6 flex items-center">

          <span>
            Total Teams:
            <strong className="ml-2">
              {filteredTeams.length}
            </strong>
          </span>

        </div>

      </div>

      {/* Loading */}

      {loading ? (

        <div className="text-xl">
          Loading Teams...
        </div>

      ) : filteredTeams.length === 0 ? (

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

          <FaUsers
            size={60}
            className="mx-auto text-slate-500 mb-4"
          />

          <h2 className="text-2xl font-bold">
            No Teams Found
          </h2>

          <p className="text-slate-400 mt-2">
            Create your first team to begin collaboration.
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredTeams.map((team, index) => (

            <div
              key={team.id || index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300"
            >

              <h2 className="text-xl font-bold">
                {team.team_name || "Unnamed Team"}
              </h2>

              <p className="text-slate-400 mt-3 min-h-[60px]">
                {
                  team.description ||
                  "No description available"
                }
              </p>

              <div className="mt-4">

                <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
                  {team.status || "active"}
                </span>

              </div>

              <div className="mt-4 text-xs text-slate-500 break-all">

                Team ID:
                <br />
                {team.id || "Missing ID"}

              </div>

              {
                team.id ? (

                  <Link
                    to={`/teams/${team.id}`}
                    className="block text-center w-full mt-6 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl"
                  >
                    View Team
                  </Link>

                ) : (

                  <button
                    disabled
                    className="w-full mt-6 bg-slate-700 py-3 rounded-xl opacity-50"
                  >
                    Team ID Missing
                  </button>

                )
              }

            </div>

          ))}

        </div>

      )}

      {/* Create Team Modal */}

      {showModal && (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">

          <div className="bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-slate-800">

            <h2 className="text-2xl font-bold mb-6">
              Create New Team
            </h2>

            <form onSubmit={createTeam}>

              <div className="mb-4">

                <label className="block mb-2">
                  Team Name
                </label>

                <input
                  type="text"
                  required
                  value={teamData.team_name}
                  onChange={(e) =>
                    setTeamData({
                      ...teamData,
                      team_name: e.target.value
                    })
                  }
                  className="w-full bg-slate-800 p-3 rounded-xl outline-none"
                />

              </div>

              <div className="mb-6">

                <label className="block mb-2">
                  Description
                </label>

                <textarea
                  rows="4"
                  value={teamData.description}
                  onChange={(e) =>
                    setTeamData({
                      ...teamData,
                      description: e.target.value
                    })
                  }
                  className="w-full bg-slate-800 p-3 rounded-xl outline-none"
                />

              </div>

              <div className="flex gap-3">

                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl"
                >
                  {
                    creating
                      ? "Creating..."
                      : "Create Team"
                  }
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}

export default Teams;