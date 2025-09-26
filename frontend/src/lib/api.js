import axios from "axios";

const api = axios.create({
  baseURL: "https://shoe-world-base.onrender.com", 
  withCredentials: true,
});

export default api;