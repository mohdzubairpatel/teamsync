import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function Invitations() {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await api.get("/invitations/my");
      setInvitations(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptInvitation = async (id) => {
    try {
      await api.post(`/invitations/accept/${id}`);
      fetchInvitations();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectInvitation = async (id) => {
    try {
      await api.post(`/invitations/reject/${id}`);
      fetchInvitations();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Team Invitations
      </h1>

      <div className="space-y-4">
        {invitations.map((invite) => (
          <div
            key={invite.id}
            className="bg-slate-900 p-5 rounded-xl border border-slate-800"
          >
            <h2 className="font-bold text-xl">
              {invite.team_name}
            </h2>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => acceptInvitation(invite.id)}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Accept
              </button>

              <button
                onClick={() => rejectInvitation(invite.id)}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Invitations;