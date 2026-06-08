import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUsers } from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login Response:", response.data);

      login(response.data.token);

      localStorage.setItem(
        "user_id",
        response.data.user_id
      );

      localStorage.setItem(
        "user_name",
        response.data.name
      );

      localStorage.setItem(
      "user_email",
      response.data.email
  );

      localStorage.setItem(
        "role",
        response.data.role
      );

      navigate("/dashboard");

    } catch (err) {

      console.log("Login Error:", err);
      console.log("Backend Response:", err.response?.data);

      setError(
        err.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-700 to-indigo-900">

          <div className="flex items-center gap-3 mb-6">
            <FaUsers className="text-5xl text-white" />
            <h1 className="text-4xl font-bold text-white">
              TeamSync
            </h1>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Collaborate Better.
          </h2>

          <p className="text-blue-100 text-lg leading-relaxed">
            Manage teams, tasks, invitations,
            notifications and real-time collaboration
            from one powerful platform.
          </p>

        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12">

          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold text-white">
              Welcome Back
            </h2>

            <p className="text-slate-400 mt-2">
              Sign in to continue
            </p>

          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-5">

              <label className="block text-slate-300 mb-2">
                Email Address
              </label>

              <div className="flex items-center bg-slate-800 rounded-xl px-4">
                <FaEnvelope className="text-slate-400" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent p-4 text-white outline-none"
                />
              </div>

            </div>

            <div className="mb-6">

              <label className="block text-slate-300 mb-2">
                Password
              </label>

              <div className="flex items-center bg-slate-800 rounded-xl px-4">
                <FaLock className="text-slate-400" />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent p-4 text-white outline-none"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 p-4 rounded-xl font-semibold text-white"
            >
              {loading ? "Signing In..." : "Login"}
            </button>

          </form>

          <div className="mt-6 text-center">

            <span className="text-slate-400">
              Don't have an account?
            </span>

            <Link
              to="/register"
              className="ml-2 text-blue-400 hover:text-blue-300"
            >
              Register
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;