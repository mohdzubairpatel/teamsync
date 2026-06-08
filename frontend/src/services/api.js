import axios from "axios";

const api = axios.create({
  baseURL: "https://teamsync-qsbs.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN =", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("HEADERS =", config.headers);

  return config;
});

export default api;