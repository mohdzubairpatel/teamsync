import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://teamsync-qsbs.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN FOUND:", token);
  console.log("REQUEST URL:", config.url);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("AUTH HEADER ADDED");
  }

  return config;
});

export default api;