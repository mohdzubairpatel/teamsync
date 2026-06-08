import { useEffect, useState } from "react";
import {
  FaUserClock,
  FaCheck,
  FaTimes
} from "react-icons/fa";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function TeamRequests() {

  const [teamId, setTeamId] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const savedTeamId =
      localStorage.getItem("selected_team_id");

    if (savedTeamId) {

      setTeamId(savedTeamId);

      fetchRequests(savedTeamId);

    } else {

      setLoading(false);

    }

  }, []);

  const fetchRequests = async (id) => {

    try {

      const response = await api.get(
        `/team-requests/team/${id}`
      );

      setRequests(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  const approveRequest = async (requestId) => {

    try {

      await api.put(
        `/team-requests/approve/${requestId}`
      );

      fetchRequests(teamId);

    } catch (error) {

      console.log(error);

    }

  };

  const rejectRequest = async (requestId) => {

    try {

      await api.put(
        `/team-requests/reject/${requestId}`
      );

      fetchRequests(teamId);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Team Join Requests
        </h1>

        <p className="text-slate-400 mt-2">
          Manage incoming join requests
        </p>

      </div>

      {loading ? (

        <div className="text-xl">
          Loading Requests...
        </div>

      ) : requests.length === 0 ? (

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

          <FaUserClock
            size={60}
            className="mx-auto text-slate-500 mb-4"
          />

          <h2 className="text-2xl font-bold">
            No Pending Requests
          </h2>

        </div>

      ) : (

        <div className="space-y-4">

          {requests.map((request) => (

            <div
              key={request.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center"
            >

              <div>

                <h2 className="font-bold text-lg">
                  User ID
                </h2>

                <p className="text-slate-400">
                  {request.user_id}
                </p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    approveRequest(request.id)
                  }
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <FaCheck />
                  Approve
                </button>

                <button
                  onClick={() =>
                    rejectRequest(request.id)
                  }
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <FaTimes />
                  Reject
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </DashboardLayout>

  );
}

export default TeamRequests;