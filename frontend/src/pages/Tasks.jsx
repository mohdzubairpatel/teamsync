import { useEffect, useState } from "react";
import { FaPlus, FaTasks } from "react-icons/fa";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    team_id: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchTeams();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get(
        "/tasks/my-tasks"
      );

      console.log(
        "Tasks Response:",
        response.data
      );

      setTasks(response.data || []);
    } catch (error) {
      console.log(
        "Task Fetch Error:",
        error.response?.data
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get(
        "/teams/my-teams"
      );

      console.log(
        "Teams Response:",
        response.data
      );

      setTeams(response.data || []);
    } catch (error) {
      console.log(
        "Team Fetch Error:",
        error.response?.data
      );
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/tasks/create",
        taskData
      );

      console.log(
        "Task Created:",
        response.data
      );

      setTaskData({
        title: "",
        description: "",
        team_id: "",
      });

      setShowModal(false);

      fetchTasks();
    } catch (error) {
      console.log(
        "Task Create Error:",
        error.response?.data
      );

      alert("Task creation failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Tasks
          </h1>

          <p className="text-slate-400">
            Manage your team tasks
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <FaPlus />
          Create Task
        </button>
      </div>

      <div className="mb-4 text-slate-400">
        Total Tasks: {tasks.length}
      </div>

      {loading ? (
        <div className="text-center py-10">
          Loading Tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
          <FaTasks
            size={60}
            className="mx-auto mb-4 text-slate-500"
          />

          <h2 className="text-2xl font-bold">
            No Tasks Found
          </h2>

          <p className="text-slate-400 mt-2">
            Create your first task.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold">
                {task.title}
              </h2>

              <p className="text-slate-400 mt-3">
                {task.description}
              </p>

              <div className="mt-5">
                <span className="bg-yellow-600 px-3 py-1 rounded-full text-sm">
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-slate-800">
            <h2 className="text-2xl font-bold mb-6">
              Create Task
            </h2>

            <form onSubmit={createTask}>
              <input
                type="text"
                placeholder="Task Title"
                required
                value={taskData.title}
                onChange={(e) =>
                  setTaskData({
                    ...taskData,
                    title: e.target.value,
                  })
                }
                className="w-full bg-slate-800 p-3 rounded-xl mb-4"
              />

              <textarea
                rows="4"
                placeholder="Task Description"
                value={taskData.description}
                onChange={(e) =>
                  setTaskData({
                    ...taskData,
                    description: e.target.value,
                  })
                }
                className="w-full bg-slate-800 p-3 rounded-xl mb-4"
              />

              <select
                required
                value={taskData.team_id}
                onChange={(e) =>
                  setTaskData({
                    ...taskData,
                    team_id: e.target.value,
                  })
                }
                className="w-full bg-slate-800 p-3 rounded-xl mb-6"
              >
                <option value="">
                  Select Team
                </option>

                {teams.map((team) => (
                  <option
                    key={team.id}
                    value={team.id}
                  >
                    {team.team_name}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 py-3 rounded-xl"
                >
                  Create
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 bg-slate-700 py-3 rounded-xl"
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

export default Tasks;