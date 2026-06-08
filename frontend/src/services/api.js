import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://teamsync-qsbs.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN =", token);
  console.log("BEFORE HEADERS =", config.headers);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("AUTH HEADER ADDED");
  }

  console.log("AFTER HEADERS =", config.headers);

  return config;
});

export default api;