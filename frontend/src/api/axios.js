// axios helper - use this everywhere
import axios from "axios";

const api = axios.create({
  baseURL: "https://job-tracking-backend-yejq.onrender.com/api",
  withCredentials: false,
});

// attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
