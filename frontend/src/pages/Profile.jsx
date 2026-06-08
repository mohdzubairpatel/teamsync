import {
  FaUser,
  FaEnvelope,
  FaBriefcase,
  FaGraduationCap,
  FaAward,
} from "react-icons/fa";

import DashboardLayout from "../layouts/DashboardLayout";

function Profile() {
  const userName =
    localStorage.getItem("user_name") || "User";

  const userEmail =
    localStorage.getItem("user_email") ||
    "user@email.com";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Section */}
            <div className="flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                <FaUser size={70} />
              </div>

              <h2 className="text-2xl font-bold mt-4">
                {userName}
              </h2>

              <span className="bg-blue-600 px-4 py-1 rounded-full mt-2 text-sm">
                TeamSync Member
              </span>
            </div>

            {/* Details Section */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-6">
                My Profile
              </h1>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-5 rounded-2xl hover:bg-slate-700 transition">
                  <FaEnvelope className="mb-3 text-blue-400 text-xl" />

                  <p className="text-slate-400">
                    Email
                  </p>

                  <h3 className="font-medium">
                    {userEmail}
                  </h3>
                </div>

                <div className="bg-slate-800 p-5 rounded-2xl hover:bg-slate-700 transition">
                  <FaBriefcase className="mb-3 text-green-400 text-xl" />

                  <p className="text-slate-400">
                    Profession
                  </p>

                  <h3 className="font-medium">
                    Full Stack Developer
                  </h3>
                </div>

                <div className="bg-slate-800 p-5 rounded-2xl hover:bg-slate-700 transition">
                  <FaGraduationCap className="mb-3 text-yellow-400 text-xl" />

                  <p className="text-slate-400">
                    Education
                  </p>

                  <h3 className="font-medium">
                    B.E Computer Science
                  </h3>
                </div>

                <div className="bg-slate-800 p-5 rounded-2xl hover:bg-slate-700 transition">
                  <FaAward className="mb-3 text-purple-400 text-xl" />

                  <p className="text-slate-400">
                    Experience
                  </p>

                  <h3 className="font-medium">
                    Intermediate
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;