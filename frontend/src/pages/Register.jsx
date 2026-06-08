import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setSuccess("");

      await api.post("/auth/register", formData);

      setSuccess("Registration successful!");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Create Account
        </h1>

        <p className="text-slate-400 text-center mb-8">
          Join TeamSync today
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-4">

            <label className="text-slate-300 block mb-2">
              Full Name
            </label>

            <div className="flex items-center bg-slate-800 rounded-xl px-4">
              <FaUser className="text-slate-400" />

              <input
                type="text"
                name="name"
                required
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent p-4 text-white outline-none"
              />
            </div>

          </div>

          <div className="mb-4">

            <label className="text-slate-300 block mb-2">
              Email
            </label>

            <div className="flex items-center bg-slate-800 rounded-xl px-4">
              <FaEnvelope className="text-slate-400" />

              <input
                type="email"
                name="email"
                required
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent p-4 text-white outline-none"
              />
            </div>

          </div>

          <div className="mb-6">

            <label className="text-slate-300 block mb-2">
              Password
            </label>

            <div className="flex items-center bg-slate-800 rounded-xl px-4">
              <FaLock className="text-slate-400" />

              <input
                type="password"
                name="password"
                required
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent p-4 text-white outline-none"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition p-4 rounded-xl font-semibold text-white"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="text-center mt-6 text-slate-400">

          Already have an account?

          <Link
            to="/"
            className="text-blue-400 ml-2"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;