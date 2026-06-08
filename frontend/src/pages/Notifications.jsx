import {
  FaBell,
  FaCheckCircle
} from "react-icons/fa";

import DashboardLayout from "../layouts/DashboardLayout";

function Notifications() {

  const notifications = [
    {
      id: 1,
      title: "Team Invitation",
      message:
        "You have been invited to join AI Innovators Team.",
      read: false
    },
    {
      id: 2,
      title: "Task Assigned",
      message:
        "A new task has been assigned to you.",
      read: true
    }
  ];

  return (

    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Notifications
        </h1>

        <p className="text-slate-400 mt-2">
          Stay updated with your workspace
        </p>

      </div>

      <div className="space-y-4">

        {notifications.map((notification) => (

          <div
            key={notification.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex justify-between items-center"
          >

            <div>

              <h2 className="font-bold text-lg">
                {notification.title}
              </h2>

              <p className="text-slate-400 mt-2">
                {notification.message}
              </p>

            </div>

            {notification.read ? (

              <FaCheckCircle
                className="text-green-500"
                size={24}
              />

            ) : (

              <FaBell
                className="text-yellow-500"
                size={24}
              />

            )}

          </div>

        ))}

      </div>

    </DashboardLayout>

  );
}

export default Notifications;